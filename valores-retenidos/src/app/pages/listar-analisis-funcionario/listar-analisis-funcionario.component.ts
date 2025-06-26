import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { IngresoFuncionarioService } from '../../services/ingreso-funcionario.service';

@Component({
  selector: 'app-listar-analisis-funcionario',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    FormsModule
  ],
  templateUrl: './listar-analisis-funcionario.component.html',
  styleUrls: ['./listar-analisis-funcionario.component.css']
})
export class ListarAnalisisFuncionarioComponent implements OnInit, AfterViewInit {

  valorBusqueda: string = '';

  displayedColumns: string[] = [
    'fechaCreacion',
    'rutFuncioario',
    'nombreFuncionario',
    'gradoFuncionario',
    'concepto',
    'periodoRemuneracion',
    'motivoPago',
    'montoRemuneracion',
    'motivoBloqueo',
    'ncuDOE',
    'observaciones',
    'estado',
    'acciones'
  ];

  dataSource = new MatTableDataSource<any>([]);

  gradoFuncionario = [
    { id: 1, nombre: '1. General Director' },
    { id: 2, nombre: '2. General Inspector' },
    { id: 3, nombre: '3. General' },
    { id: 4, nombre: '4. Grado 4' },
    { id: 5, nombre: '5. Coronel' },
    { id: 6, nombre: '6. Grado 6' },
    { id: 7, nombre: '7. Teniente Coronel' },
    { id: 8, nombre: '8. Mayor' },
    { id: 9, nombre: '9. Capitán' },
    { id: 10, nombre: '10. Grado 10' },
    { id: 11, nombre: '11. Teniente ó SOM' },
    { id: 12, nombre: '12. Subteniente o Suboficial' },
    { id: 13, nombre: '13. Sargento 1°' },
    { id: 14, nombre: '14. Sargento 2°' },
    { id: 15, nombre: '15. Cabo 1°' },
    { id: 16, nombre: '16. Cabo 2°' },
    { id: 17, nombre: '17. Carabinero' },
    { id: 18, nombre: '18. Sin grado' },
  ];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private ingresoService: IngresoFuncionarioService) {}

  ngOnInit(): void {
    this.ingresoService.obtenerIngresos().subscribe({
      next: (data: any[]) => {
        const registrosPlano: any[] = [];

        data.forEach(ingreso => {
          ingreso.periodos.forEach((periodo: any) => {
            registrosPlano.push({
              idIngreso: ingreso.id_reporte_funcionario,
              fechaCreacion: ingreso.fecha_creacion,
              rutFuncioario: ingreso.funcionario.rut,
              nombreFuncionario: ingreso.funcionario.nombre,
              gradoFuncionario: ingreso.funcionario.grado_nombre,
              concepto: ingreso.concepto_nombre, // ✅ Usamos el nombre
              motivoBloqueo: ingreso.motivo_bloqueo,
              periodoRemuneracion: periodo.periodo_remuneracion,
              motivoPago: periodo.motivo_pago_nombre, // ✅ mostrará "Sueldo", "Viático", etc.
              montoRemuneracion: periodo.monto,
              ncuDOE: ingreso.ncu_doe,
              observaciones: ingreso.observaciones,
              estado: ingreso.estado_nombre  // ✅ Nuevo campo
            });
          });
        });

        this.dataSource.data = registrosPlano;
      },
      error: err => {
        console.error('Error al obtener ingresos:', err);
      }
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  aplicarFiltroManual(event: Event) {
    const filtroValor = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) =>
      data.rutFuncioario?.toLowerCase().includes(filter) ||
      data.nombreFuncionario?.toLowerCase().includes(filter) ||
      data.ncuDOE?.toString().includes(filter) ||
      data.montoRemuneracion?.toString().includes(filter);
    this.dataSource.filter = filtroValor;
  }



  obtenerIdGrado(nombre: string): number {
    const grado = this.gradoFuncionario.find(g => g.nombre === nombre);
    return grado?.id || -1;
  }


  editarRegistro(registro: any): void {
    console.log('Editar registro:', registro);
  }

  eliminarRegistro(registro: any): void {
  const id = registro.idIngreso;
  if (!id) {
    console.warn('ID no encontrado');
    return;
  }

  if (confirm('¿Estás seguro de eliminar este ingreso?')) {
      this.ingresoService.eliminarIngreso(id).subscribe({
        next: () => {
          // Filtrar la fila eliminada del listado
          this.dataSource.data = this.dataSource.data.filter(r => r.idIngreso !== id);
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
        }
      });
    }
  }
}
