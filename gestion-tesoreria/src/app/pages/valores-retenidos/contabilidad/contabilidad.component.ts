import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { IngresoFuncionarioService } from '../../../services/ingreso-funcionario.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contabilidad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.css']
})
export class ContabilidadComponent implements OnInit, AfterViewInit {

  valorBusqueda = '';

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
  'nroComprobanteContable',
  'observacionesContabilidad',
  'estado',
  'acciones'
];


  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ingresoService: IngresoFuncionarioService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.cargarIngresos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarIngresos(): void {
    this.ingresoService.obtenerIngresos().subscribe({
      next: (data: any[]) => {
        const registros: any[] = [];
        data.forEach(ingreso => {
          ingreso.periodos.forEach((periodo: any) => {
            registros.push({
              idIngreso: ingreso.id_reporte_funcionario,
              fechaCreacion: ingreso.fecha_creacion,
              rutFuncioario: ingreso.funcionario.rut,
              nombreFuncionario: ingreso.funcionario.nombre,
              gradoFuncionario: ingreso.funcionario.grado_nombre,
              concepto: ingreso.concepto_nombre,
              periodoRemuneracion: periodo.periodo_remuneracion,
              motivoPago: periodo.motivo_pago_nombre,
              montoRemuneracion: periodo.monto,
              motivoBloqueo: ingreso.motivo_bloqueo,
              ncuDOE: ingreso.ncu_doe,
              observaciones: ingreso.observaciones,
              nroComprobanteContable: ingreso.nro_comprobante_contable,
              observacionesContabilidad: ingreso.observaciones_contabilidad,
              estado: ingreso.estado_nombre
            });
          });
        });
        this.dataSource.data = registros;
      }
    });

  }

  aplicarFiltroManual(event: Event) {
    const filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, f) =>
      data.rutFuncioario?.toLowerCase().includes(f) ||
      data.nombreFuncionario?.toLowerCase().includes(f) ||
      data.ncuDOE?.toString().includes(f);
    this.dataSource.filter = filter;
  }

  historialRegistro(registro: any): void{
    alert("Generar modal con historial ")
    console.log("Botón historial apretado")
  }

  rechazoRegistro(registro: any): void{
    alert("Alerta de rechazo! Devolver a Análisis")
    console.log("Botón rechazo apretado")
  }

  editarRegistro(registro: any): void {
    const nro = prompt('Ingrese N° Comprobante Contable:', registro.nroComprobanteContable || '');
    if (nro === null) return;

    const obs = prompt('Ingrese Observaciones Contabilidad:', registro.observacionesContabilidad || '');
    if (obs === null) return;

    const payload = {
      nro_comprobante_contable: nro,
      observaciones_contabilidad: obs
    };

    this.ingresoService.actualizarIngreso(registro.idIngreso, payload).subscribe({
      next: () => {
        alert('Registro actualizado correctamente.');
        this.cargarIngresos(); // refrescar listado
      },
      error: err => {
        console.error('Error al actualizar:', err);
        alert('Error al actualizar el registro.');
      }
    });
  }

    //////////SIMULADO//////////
  registroCompleto(element: any): boolean {
    return true
    //return element.rutFuncioario && element.nombreFuncionario && element.gradoFuncionario &&
          //element.concepto && element.periodoRemuneracion && element.motivoPago &&
          //element.montoRemuneracion != null && element.estado === 'Por enviar';
  }

  
    //////////SIMULADO//////////
  enviarAContabilidad(element: any): void {
    const confirmado = confirm(`¿Estás seguro que deseas enviar al funcionario "${element.nombreFuncionario}" a Contabilidad?`);

    //if (!confirmado) return;

    // Actualizamos el estado del funcionario a 'Enviado'
    const funcionarioEnviado = { ...element, estado: 'Enviado' };

    // Añadir a la segunda tabla (Contabilidad)
    //this.funcionariosEnviados.data = [...this.funcionariosEnviados.data, funcionarioEnviado];

    // Eliminar de la tabla principal
    this.dataSource.data = this.dataSource.data.filter(f => f.idIngreso !== element.idIngreso);

    // Mostrar notificación
    this.snackBar.open(`Funcionario "${element.nombreFuncionario}" enviado a Contabilidad.`, 'Cerrar', {
      duration: 3500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success'] // Puedes definir esta clase en tu CSS si deseas personalizarla
    });
  }


  eliminarRegistro(registro: any): void {
    const id = registro.idIngreso;
    if (!id) {
      console.warn('ID no encontrado');
      return;
    }

    if (confirm('¿Está seguro de eliminar este ingreso?')) {
      this.ingresoService.eliminarIngreso(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(r => r.idIngreso !== id);
        },
        error: err => {
          console.error('Error al eliminar:', err);
        }
      });
    }
  }
}
