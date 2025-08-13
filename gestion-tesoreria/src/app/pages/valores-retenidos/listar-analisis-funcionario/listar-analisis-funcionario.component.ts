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
import { IngresoFuncionarioService } from '../../../services/ingreso-funcionario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditarFilaComponent } from '../../../components/valores-retenidos/dialog-editar-fila/dialog-editar-fila.component';
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
        console.log("Grados retribuidos:",grados)
        console.log("Conceptos retribuidos:",conceptos)
        console.log("Motivos retribuidos:",motivosPago)
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
        console.log("Funcionarios retribuidos:",data)
        const registrosPlano: any[] = [];

        data.forEach(ingreso => {
          ingreso.periodos.forEach((periodo: any) => {
            registrosPlano.push({
              idIngreso: ingreso.id_reporte_funcionario,
              idPeriodo: periodo.id_periodo_remuneracion,  

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

      // --- PATCH al ingreso (top-level) ---
      const patch: any = {};

      if (resultado.ncuDOE != null && resultado.ncuDOE !== registro.ncuDOE) {
        patch.ncu_doe = Number(String(resultado.ncuDOE).replace(/\D/g, '')) || 0;
      }

      if (resultado.motivoBloqueo !== registro.motivoBloqueo) {
        patch.motivo_bloqueo = resultado.motivoBloqueo ?? '';
      }

      if (resultado.concepto && resultado.concepto !== registro.conceptoNombre) {
        const conceptoId = this.obtenerIdConcepto(resultado.concepto);
        if (conceptoId === -1) {
          this.snackBar.open('Concepto no válido', 'Cerrar', { duration: 3000 });
          return;
        }
        patch.concepto = conceptoId;
      }

      if (resultado.nombreFuncionario || resultado.gradoFuncionario) {
        patch.funcionario = {
          rut: registro.funcionario.rut,
          nombre: resultado.nombreFuncionario ?? registro.funcionario.nombre,
          grado: resultado.gradoFuncionario ?? registro.funcionario.grado_id,
        };
      }

      // --- PATCH al período ---
      const periodPatch: any = {};
      // monto
      if (resultado.montoRemuneracion != null && resultado.montoRemuneracion !== registro.montoRemuneracion) {
        periodPatch.monto = Number(String(resultado.montoRemuneracion).replace(/\D/g, '')) || 0;
      }
      // motivo de pago
      if (resultado.motivoPago && resultado.motivoPago !== registro.motivoPagoNombre) {
        const motivoId = this.obtenerIdMotivoPago(resultado.motivoPago);
        if (motivoId === -1) {
          this.snackBar.open('Motivo de pago no válido', 'Cerrar', { duration: 3000 });
          return;
        }
        periodPatch.motivo_pago = motivoId;
      }
      // periodo remuneración (si lo editas en el modal)
      if (resultado.periodoRemuneracion && resultado.periodoRemuneracion !== registro.periodoFecha) {
        // Asegúrate de enviar formato YYYY-MM-01 si tu API lo espera
        periodPatch.periodo_remuneracion = resultado.periodoRemuneracion;
      }

      // Nada que actualizar
      if (!Object.keys(patch).length && !Object.keys(periodPatch).length) {
        this.snackBar.open('No hay cambios para actualizar', 'Cerrar', { duration: 2500 });
        return;
      }

      // Dispara una o ambas requests
      const calls = [];
      const idIngreso = registro.ingresoID ?? registro.idIngreso;
      if (Object.keys(patch).length) {
        calls.push(this.ingresoService.actualizarIngreso(idIngreso, patch));
      }
      if (Object.keys(periodPatch).length) {
        const idPeriodo = registro.idPeriodo;
        calls.push(this.ingresoService.actualizarPeriodo(idPeriodo, periodPatch));
      }

      // Si hay 2 llamadas, únelas; si hay 1, llama directo
      if (calls.length === 1) {
        calls[0].subscribe({
          next: () => this.snackBar.open('Registro actualizado', 'Cerrar', { duration: 3000 }),
          error: err => {
            console.error('Error al actualizar:', err);
            this.snackBar.open('Error al actualizar el registro', 'Cerrar', { duration: 4000 });
          }
        });
      } else {
        // 2 llamadas
        forkJoin(calls).subscribe({
          next: () => this.snackBar.open('Registro actualizado', 'Cerrar', { duration: 3000 }),
          error: err => {
            console.error('Error al actualizar:', err);
            this.snackBar.open('Error al actualizar el registro', 'Cerrar', { duration: 4000 });
          }
        });
      }
    });

  }


  // Reemplaza los actuales:
  obtenerIdMotivoPago(nombre: string): number {
    const m = this.motivosPago.find(mp => mp.nombre_motivo_pago === nombre);
    return m ? m.id_motivopago : -1;
  }

  obtenerIdConcepto(nombre: string): number {
    const c = this.conceptos.find(cc => cc.nombre_concepto === nombre);
    return c ? c.id_concepto : -1;
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
          this.snackBar.open('Ingreso eliminado', 'Cerrar', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.snackBar.open('No se pudo eliminar el ingreso', 'Cerrar', { duration: 4000 });
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
