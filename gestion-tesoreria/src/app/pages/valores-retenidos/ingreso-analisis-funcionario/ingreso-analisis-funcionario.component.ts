import { AfterViewChecked, AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IngresoFuncionarioService } from '../../../services/ingreso-funcionario.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-ingreso-analisis-funcionario',
  standalone: true,
  imports: [
            MatSnackBarModule, MatSnackBarModule, 
            CommonModule, FormsModule, 
            ReactiveFormsModule, MatTableModule, 
            MatButtonModule, MatInputModule, 
            MatIconModule, MatPaginatorModule, 
            MatSortModule, MatFormFieldModule, 
            MatCardModule
          ],
  templateUrl: './ingreso-analisis-funcionario.component.html',
  styleUrl: './ingreso-analisis-funcionario.component.css',
  animations: [
    trigger('slideDown', [
      state('closed', style({
        height: '0',
        opacity: '0',
        overflow: 'hidden'
      })),
      state('open', style({
        height: '*',
        opacity: '1'
      })),
      transition('closed <=> open', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})

export class IngresoAnalisisFuncionarioComponent implements OnInit, AfterViewInit, AfterViewChecked {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort

  gradoFuncionario: any[] = [];
  conceptos: any[] = [];
  motivoPago: any[] = [];

  // Formulario Padre reactivo
  analisisForm: FormGroup;
  viewForm: boolean = false;
  
  //LOEADER
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private IngresoFuncionarioService: IngresoFuncionarioService

  ) {
    //Definir de forma directa
    this.analisisForm = this.fb.group({
      rutFuncioario: ['', [Validators.required, Validators.minLength(3)]],
      nombreFuncionario: ['', [Validators.required, Validators.minLength(3)]],
      gradoFuncionario: ['', Validators.required],
      motivoBloqueo: ['', Validators.required],
      concepto: ['', Validators.required], 
      ncuDOE: ['', [Validators.required, Validators.minLength(2)]],
      observacionesFuncionario: ['', [Validators.required, Validators.minLength(2)]],
      periodos: this.fb.array([this.crearPagoFormGroup()])  // Inicializamos con un grupo
    });
  }

  ngOnInit(): void {
    console.log("Primera carga");
    this.loading = true;

    forkJoin({
      grados: this.IngresoFuncionarioService.getGrados(),
      conceptos: this.IngresoFuncionarioService.getConceptos(),
      motivosPago: this.IngresoFuncionarioService.getMotivosPago()
      
    }).pipe(
      finalize(() => {
        this.loading = false; // Se ejecuta tanto si es éxito como si hay error
        console.log("this.loading:",this.loading)
      })
    ).subscribe({
      next: ({ grados, conceptos, motivosPago }) => {
        this.gradoFuncionario = grados.map(g => ({
          id: g.id_grado,
          nombre: g.nombre_grado
        }));
        this.conceptos = conceptos.map(c => ({
          id: c.id_concepto,
          nombre: c.nombre_concepto
        }));

        this.motivoPago = motivosPago.map(m => ({
          id: m.id_motivopago,
          nombre: m.nombre_motivo_pago
        }));
      },
      error: (err) => {
        console.error('Error en la carga inicial', err);
      }
    });

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewChecked() {
    if (this.dataSource.paginator !== this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.dataSource.sort !== this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  nuevoFuncionario(): void {
    this.viewForm = true;
    
    // Resetear el formulario con valores iniciales
    this.analisisForm.reset();

    // Limpiar el array de pagos y agregar uno nuevo vacío
    const pagosArray = this.analisisForm.get('pagos') as FormArray;
    pagosArray.clear();
    pagosArray.push(this.crearPagoFormGroup());
  }



  obtenerIdGradoDesdeTexto(nombre: string): number | null {
    const match = this.gradoFuncionario.find(g =>
      nombre.toLowerCase().includes(g.nombre.toLowerCase())
    );
    return match?.id ?? null;
  }

  obtenerIdMotivoPagoDesdeTexto(nombre: string): number | null {
    const match = this.motivoPago.find(m =>
      nombre.toLowerCase().includes(m.nombre.toLowerCase())
    );
    return match?.id ?? null;
  }

  convertirFecha(valor: string): string {
    const partes = valor?.split('/');
    if (partes.length === 2) {
      const [mes, año] = partes;
      const fecha = new Date(+año, +mes - 1, 1);
      return fecha.toISOString().split('T')[0];
    }
    return '';
  }




  crearPagoFormGroup(): FormGroup {
    return this.fb.group({
      periodoRemuneracion: ['', Validators.required],
      motivoPago: ['', Validators.required],
      montoRemuneracion: ['', Validators.required]
    });
    
  }

  get periodos(): FormArray {
    return this.analisisForm.get('periodos') as FormArray;
  }

  agregarPeriodo(): void {
    console.log("Boton agregar periodo clickeado")
    this.periodos.push(this.crearPagoFormGroup());
  }

  cerrarFormulario(): void {
    // Limpia el formulario reactivo
    this.analisisForm.reset();

    // Oculta el formulario
    this.viewForm = false;

  }




  eliminarPago(index: number): void {
    if (this.periodos.length > 1) {
      this.periodos.removeAt(index);
    }
  }

  //Mostrar alerta con MatSnack
  mostrarNotificacionSnackBar(mensaje: string) {

    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000, // duración en milisegundos
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-custom']
    });

  }

  // Lógica de envío de datos de formulario
  onSubmit(): void {
    if (this.analisisForm.invalid) {
      this.mostrarNotificacionSnackBar('Por favor complete los campos requeridos');
      return;
    }

    const form = this.analisisForm.value;
    
    //contenido extraido del formulario a guardar
    console.log(form)

    const payload = {
      funcionario: { 
        rut: form.rutFuncioario,
        nombre: form.nombreFuncionario,
        grado: parseInt(form.gradoFuncionario)
      },
      concepto: form.concepto,
      ncu_doe: parseInt(form.ncuDOE, 10),
      motivo_bloqueo: form.motivoBloqueo,
      observaciones_analisis: form.observacionesFuncionario,
      periodos: form.periodos.map((p: any) => ({
        periodo_remuneracion: p.periodoRemuneracion+"-01",
        motivo_pago: parseInt(p.motivoPago, 10),
        monto: parseFloat(p.montoRemuneracion.toString().replace('.', '').replace(',', '.'))
      }))
    };
    
    //contenido a enviar a base de datos
    console.log(payload);
    
    this.IngresoFuncionarioService.crearIngreso(payload).subscribe({
      next: (res) => {
        this.mostrarNotificacionSnackBar(res.message);
        this.analisisForm.reset();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.mostrarNotificacionSnackBar('Error al guardar el ingreso');
      }
    });

  }
} 