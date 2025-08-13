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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditarFilaComponent } from '../../components/dialog-editar-fila/dialog-editar-fila.component';
import { forkJoin } from 'rxjs';



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
    'acciones' // ✅ solo para tabla principal
  ];

  dataSource = new MatTableDataSource<any>([]);

  //////////SIMULADO//////////
  displayedColumnsSinAcciones: string[] = this.displayedColumns.filter(col => col !== 'acciones');
  //////////SIMULADO//////////

  // gradoFuncionario = [
  //   { id: 1, nombre: '1. General Director' },
  //   { id: 2, nombre: '2. General Inspector' },
  //   { id: 3, nombre: '3. General' },
  //   { id: 4, nombre: '4. Grado 4' },
  //   { id: 5, nombre: '5. Coronel' },
  //   { id: 6, nombre: '6. Grado 6' },
  //   { id: 7, nombre: '7. Teniente Coronel' },
  //   { id: 8, nombre: '8. Mayor' },
  //   { id: 9, nombre: '9. Capitán' },
  //   { id: 10, nombre: '10. Grado 10' },
  //   { id: 11, nombre: '11. Teniente ó SOM' },
  //   { id: 12, nombre: '12. Subteniente o Suboficial' },
  //   { id: 13, nombre: '13. Sargento 1°' },
  //   { id: 14, nombre: '14. Sargento 2°' },
  //   { id: 15, nombre: '15. Cabo 1°' },
  //   { id: 16, nombre: '16. Cabo 2°' },
  //   { id: 17, nombre: '17. Carabinero' },
  //   { id: 18, nombre: '18. Sin grado' },
  // ];

  //   motivosPago = [
  //   { id: 1, nombre: '1° Línea' },
  //   { id: 2, nombre: '2° Línea' },
  //   { id: 3, nombre: 'Renovación' }
  // ];

  // conceptos = [
  //   { id: 1, nombre: 'Aguinaldo Fiestas Patrias' },
  //   { id: 2, nombre: 'Aguinaldo Navidad' },
  //   { id: 3, nombre: 'Bono Escolaridad' },
  //   { id: 9, nombre: 'Reintegro' }
  // ];

  conceptos: any[] = [];

  gradosFuncionario: any[] = []

  motivosPago: any[] = [];

  funcionariosEnviados = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  //////////SIMULADO//////////
  @ViewChild('sortPrincipal') sortPrincipal!: MatSort;
  @ViewChild('sortSecundario') sortSecundario!: MatSort;
  listaConceptos: any;
  

  //////////SIMULADO//////////

  constructor(
    private ingresoService: IngresoFuncionarioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private IngresoFuncionarioService: IngresoFuncionarioService
  ) {}



  ngOnInit(): void {
    forkJoin({
      grados: this.IngresoFuncionarioService.getGrados(),
      conceptos: this.IngresoFuncionarioService.getConceptos(),
      motivosPago: this.IngresoFuncionarioService.getMotivosPago()
    }).subscribe({
      next: ({ grados, conceptos, motivosPago }) => {
        //
        console.log(grados)
        console.log(conceptos)
        console.log(motivosPago)
        //

        this.conceptos = conceptos
        this.gradosFuncionario = grados
        this.motivosPago = motivosPago
      },
      error: (err) => {
        console.error('Error en la carga inicial', err);
      }
    })
    
    this.ingresoService.obtenerIngresos().subscribe({
      next: (data: any[]) => {
        console.log(data)
        const registrosPlano: any[] = [];

        data.forEach(ingreso => {
          ingreso.periodos.forEach((periodo: any) => {
            registrosPlano.push({
              ingresoID: ingreso.id_reporte_funcionario,

              periodoID: periodo.id_periodo_remuneracion,  
              periodoFecha: periodo.periodo_remuneracion,

              conceptoNombre: ingreso.concepto_nombre,
              conceptoId: ingreso.concepto,                
              
              motivoPagoID: periodo.motivo_pago,           
              motivoPagoNombre: periodo.motivo_pago_nombre,         

              fechaCreacion: ingreso.fecha_creacion,
              funcionario: ingreso.funcionario,        
              motivoBloqueo: ingreso.motivo_bloqueo,
              
              montoRemuneracion: periodo.monto,
              ncuDOE: ingreso.ncu_doe,
              observaciones: ingreso.observaciones_analisis,
              estadoNombre: ingreso.estado_nombre,
              // estadoID: ingreso.estadoID
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
    // this.dataSource.paginator = this.paginator;   ORIGINAL
    // this.dataSource.sort = this.sort;             ORIGINAL

    //////////SIMULADO//////////
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortPrincipal;
    this.funcionariosEnviados.sort = this.sortSecundario;
    //////////SIMULADO//////////
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



  // obtenerIdGrado(nombre: string): number {
  //   const grado = this.gradoFuncionario.find(g => g.nombre === nombre);
  //   return grado?.id || -1;
  // }



  editarRegistro(registro: any): void {
    const dialogRef = this.dialog.open(DialogEditarFilaComponent, {
      width: '50vw',
      maxWidth: '95vw',
      autoFocus: false,
      data: { 
        ...registro,
        infoGeneral: {
          conceptos: this.conceptos,
          gradosFuncionario: this.gradosFuncionario,
          motivosPago: this.motivosPago
        }

      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (!resultado) return;

      const payload = {
        funcionario: {
          rut: registro.rutFuncioario,
          nombre: resultado.nombreFuncionario,
          grado: resultado.gradoFuncionario // es el ID del grado
        },
        gradoFuncionario: resultado.gradoFuncionario,
        motivoPago: this.obtenerIdMotivoPago(resultado.motivoPago), // ✅ corregido
        concepto: this.obtenerIdConcepto(resultado.concepto), // ✅ corregido
        ncu_doe: resultado.ncuDOE,
        motivo_bloqueo: resultado.motivoBloqueo,
        observaciones_analisis: resultado.observacionesFuncionario,
        periodos: [
          {
            id_periodo_remuneracion: registro.idPeriodo,
            periodo_remuneracion: resultado.periodoRemuneracion,
            motivo_pago: this.obtenerIdMotivoPago(resultado.motivoPago), // ✅ corregido
            monto: Number(resultado.montoRemuneracion)
          }
        ]
      };

      this.ingresoService.actualizarIngreso(registro.idIngreso, payload).subscribe({
        next: () => this.snackBar.open('Registro actualizado', 'Cerrar', { duration: 3000 }),
        error: err => {
          console.error('Error al actualizar:', err);
          this.snackBar.open('Error al actualizar el registro', 'Cerrar', { duration: 4000 });
        }
      });
    });
  }

  obtenerIdMotivoPago(nombre: string): number {
    return this.motivosPago.find(m => m.nombre === nombre)?.id || -1;
  }

  obtenerIdConcepto(nombre: string): number {
    return this.conceptos.find(c => c.nombre === nombre)?.id || -1;
  }

  historialRegistro(registro: any): void{
    alert("Generar modal con historial ")
    console.log("Botón historial apretado")
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


  //////////SIMULADO//////////
  registroCompleto(element: any): boolean {
    return element.rutFuncioario && element.nombreFuncionario && element.gradoFuncionario &&
          element.concepto && element.periodoRemuneracion && element.motivoPago &&
          element.montoRemuneracion != null && element.estado === 'Por enviar';
  }


    //////////SIMULADO//////////
  enviarAContabilidad(element: any): void {
    const confirmado = confirm(`¿Estás seguro que deseas enviar al funcionario "${element.nombreFuncionario}" a Contabilidad?`);

    if (!confirmado) return;

    // Actualizamos el estado del funcionario a 'Enviado'
    const funcionarioEnviado = { ...element, estado: 'Enviado' };

    // Añadir a la segunda tabla (Contabilidad)
    this.funcionariosEnviados.data = [...this.funcionariosEnviados.data, funcionarioEnviado];

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



}
