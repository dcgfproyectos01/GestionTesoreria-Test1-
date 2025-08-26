
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IngresoFuncionarioService } from '../../../services/ingreso-funcionario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/valores-retenidos/confirm-dialog/confirm-dialog.component';
<<<<<<< HEAD

=======
import { Observable, map, Subject, switchMap, startWith, shareReplay } from 'rxjs'; // ← importa map

interface Usuario {
  rut: string;
  nombre: string;
  rol?: number;
  rol_nombre?: string;
  area_trabajo?: string | null;
  grado?: number | null;
  dotacion?: string | null;
}
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)

@Component({
  selector: 'app-perfilamiento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './perfilamiento.component.html',
  styleUrls: ['./perfilamiento.component.css']
})
export class PerfilamientoComponent implements OnInit {
<<<<<<< HEAD
=======

  usuarios: any = {};
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
  
  funcionarioEncontrado: any = null;

  formEditarFuncionario!: FormGroup;

  valorBusqueda = '';
  funcionarioNoEncontrado = false;

  dataSource = new MatTableDataSource<any>([]);
  formFuncionario!: FormGroup;

<<<<<<< HEAD
=======
  private refresh$ = new Subject<void>();  // ← trigger de recarga

  //TARJETAS DE USUARIOS
  usuarios$!: Observable<Usuario[]>;
  analisis$!: Observable<Usuario[]>;
  contabilidad$!: Observable<Usuario[]>;
  pago$!: Observable<Usuario[]>;

  //CONTADORES
  analisisCount$!: Observable<number>;
  contabilidadCount$!: Observable<number>;
  pagoCount$!: Observable<number>;
  totalCount$!: Observable<number>; // opcional, para el título general

  trackByRut = (_: number, u: Usuario) => u?.rut;

>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
  roles = [
    { id: 'ADMIN', nombre: 'Administrador' },
    { id: 'DIGITADOR', nombre: 'Digitador' },
    { id: 'VALIDADOR', nombre: 'Validador' },
  ];

  areas = ['Análisis', 'Contabilidad', 'Pago'];

<<<<<<< HEAD
  constructor(
    private fb: FormBuilder,
    private servicio: IngresoFuncionarioService,
    private snackBar: MatSnackBar,
    //private dialog: MatDialog 
  ) {}

  ngOnInit(): void {
    this.formFuncionario = this.fb.group({
      rut: ['', Validators.required],
      nombre: ['', Validators.required],
      rol: ['', Validators.required],
      area_trabajo: ['', Validators.required]
    });

    this.formEditarFuncionario = this.fb.group({
      rut: ['', Validators.required],
      nombre: ['', Validators.required],
      rol: ['', Validators.required],
      area_trabajo: ['', Validators.required]
    });
  }

=======
  
  constructor(
    private fb: FormBuilder,
    private ingresoService: IngresoFuncionarioService,
    private snackBar: MatSnackBar,
    //private dialog: MatDialog 
  ) {
    this.formFuncionario = this.fb.group({ 
      rut: ['', Validators.required], 
      nombre: ['', Validators.required], 
      rol: ['', Validators.required], 
      area_trabajo: ['', Validators.required] 
    }); 
    
    this.formEditarFuncionario = this.fb.group({ 
      rut: ['', Validators.required], 
      nombre: ['', Validators.required], 
      rol: ['', Validators.required], 
      area_trabajo: ['', Validators.required] 
    }); 
  }

  ngOnInit(): void {
    // Carga de roles (ok)
    this.ingresoService.listarRolesPerfil().subscribe(roles => {
      this.roles = roles.map(r => ({ id: r.id_rol, nombre: r.nombre_rol }));
      console.log(this.ingresoService.listarRolesPerfil().subscribe())
    });



    // ✅ Fuente principal REACTIVA: usa refresh$ para re-consultar
    this.usuarios$ = this.refresh$.pipe(
      startWith(void 0), // carga inicial
      switchMap(() => this.ingresoService.obtenerFuncionarios()),
      map((r: any) => Array.isArray(r) ? r : (r?.data ?? [])),
      shareReplay(1)     // evita múltiples http por cada derivada
    );


    // Normalizador de área
    const n = (v?: string | null) =>
      (v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    // Derivadas por área
    this.analisis$     = this.usuarios$.pipe(map(list => list.filter(u => n(u.area_trabajo) === 'analisis')));
    this.contabilidad$ = this.usuarios$.pipe(map(list => list.filter(u => n(u.area_trabajo) === 'contabilidad')));
    this.pago$         = this.usuarios$.pipe(map(list => list.filter(u => n(u.area_trabajo) === 'pago')));

    // Contadores
    this.analisisCount$     = this.analisis$.pipe(map(arr => arr.length));
    this.contabilidadCount$ = this.contabilidad$.pipe(map(arr => arr.length));
    this.pagoCount$         = this.pago$.pipe(map(arr => arr.length));
    this.totalCount$        = this.usuarios$.pipe(map(arr => arr.length));
  }





>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
  // ✅ NUEVA: validación de formato mínimo
  esFormatoRutValido(rut: string): boolean {
    const rutLimpio = rut.replace(/\./g, '').replace('-', '').toUpperCase();
    return /^[0-9]{7,8}[0-9K]$/.test(rutLimpio);
  }

  // ✅ NUEVA: validación del dígito verificador
  esRutValidoConDV(rut: string): boolean {
    const rutLimpio = rut.replace(/\./g, '').replace('-', '').toUpperCase();
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvFinal = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dv === dvFinal;
  }

<<<<<<< HEAD
  // ✅ MODIFICADA: lógica completa del buscador
  buscarFuncionario() {
    const input = this.valorBusqueda.replace(/\./g, '').replace('-', '').toUpperCase().trim();

    // 🛑 1. Campo vacío
=======

  // ✅ MODIFICADA: lógica completa del buscador
  buscarFuncionario() {
    // 1) Normaliza el valor escrito
    const input = this.valorBusqueda.replace(/\./g, '').replace('-', '').toUpperCase().trim();

    // 2) Validaciones
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
    if (!input) {
      this.snackBar.open('Por favor, ingrese un RUT para realizar la búsqueda', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
<<<<<<< HEAD

      // Limpia toda la vista anterior
=======
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
      this.funcionarioEncontrado = null;
      this.funcionarioNoEncontrado = false;
      this.formEditarFuncionario.reset();
      this.formFuncionario.reset();
      return;
    }

<<<<<<< HEAD
    // 🛑 2. Formato incorrecto (mínimo esperado)
=======
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
    if (!this.esFormatoRutValido(input)) {
      this.snackBar.open('El formato del RUT no es válido', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
<<<<<<< HEAD

=======
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
      this.funcionarioEncontrado = null;
      this.funcionarioNoEncontrado = false;
      this.formEditarFuncionario.reset();
      this.formFuncionario.reset();
      return;
    }

<<<<<<< HEAD
    // 🛑 3. RUT inválido con DV o cuerpo 00000000
=======
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
    if (!this.validarRut(this.valorBusqueda)) {
      this.snackBar.open('El RUT ingresado no es válido', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
<<<<<<< HEAD

=======
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
      this.funcionarioEncontrado = null;
      this.funcionarioNoEncontrado = false;
      this.formEditarFuncionario.reset();
      this.formFuncionario.reset();
      return;
    }

<<<<<<< HEAD
    // ✅ 4. Simulación de búsqueda o llamada a API real
    if (input === '191733223') {
      // Caso encontrado
      this.funcionarioNoEncontrado = false;
      this.funcionarioEncontrado = {
        rut: '19173322-3',
        nombre: 'Pedro Pérez',
        rol: 'DIGITADOR',
        area_trabajo: 'Análisis'
      };
      this.formEditarFuncionario.patchValue(this.funcionarioEncontrado);
    } else {
      // Caso no encontrado
      this.funcionarioEncontrado = null;
      this.funcionarioNoEncontrado = true;

      this.formEditarFuncionario.reset();
      this.formFuncionario.patchValue({
        rut: this.valorBusqueda,
        nombre: '',
        rol: '',
        area_trabajo: ''
      });
    }

    // (Opcional) lógica de filtrado en tabla
=======
    // 3) Llamada real al backend
    this.ingresoService.buscarFuncionarioPerfil(input).subscribe({
      next: (f: any) => {
        this.funcionarioNoEncontrado = false;

        const areaUI =
          f.area_trabajo === 'ANALISIS' ? 'Análisis' :
          f.area_trabajo === 'CONTABILIDAD' ? 'Contabilidad' : 'Pago';

        this.funcionarioEncontrado = {
          rut: this.valorBusqueda, // opcional: formatear con puntos/guion si quieres
          nombre: f.nombre,
          rol: f.rol,               // ID numérico
          area_trabajo: areaUI
        };

        this.formEditarFuncionario.patchValue(this.funcionarioEncontrado);
      },
      error: (err) => {
        console.log(err);
        this.funcionarioEncontrado = null;
        this.funcionarioNoEncontrado = true;
        this.formEditarFuncionario.reset();
        this.formFuncionario.patchValue({
          rut: this.valorBusqueda,
          nombre: '',
          rol: '',
          area_trabajo: ''
        });
      }
    });

    // (Opcional) si sigues usando el filtro de la tabla:
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
    this.dataSource.filterPredicate = (data: any, f: string) =>
      data.rutFuncioario?.toLowerCase().includes(f) ||
      data.nombreFuncionario?.toLowerCase().includes(f) ||
      data.ncuDOE?.toString().includes(f);

    this.dataSource.filter = input;
  }

<<<<<<< HEAD


  guardarCambiosFuncionario() {
    if (this.formEditarFuncionario.invalid) return;

    const datosEditados = this.formEditarFuncionario.value;

    // Aquí iría el servicio real de actualización
    this.servicio.actualizarFuncionario(datosEditados).subscribe(() => {
      alert('Cambios guardados correctamente');
      // Opcional: recargar tabla o datos
=======
  guardarCambiosFuncionario() {
  if (this.formEditarFuncionario.invalid) return;

    const datosEditados = this.formEditarFuncionario.value;
    this.ingresoService.actualizarFuncionarioPerfil(datosEditados).subscribe({
      next: () => {
        this.snackBar.open('Cambios guardados', 'Cerrar', { duration: 2000 });
        this.refresh$.next(); // ← recarga listas y contadores
        this.funcionarioEncontrado = null;          // opcional: limpiar panel
        this.formEditarFuncionario.reset();
      }
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
    });
  }

  guardarNuevoFuncionario() {
    if (this.formFuncionario.invalid) return;

    const datos = this.formFuncionario.value;
<<<<<<< HEAD

    // Aquí debes llamar al servicio real que registra el funcionario
    this.servicio.crearFuncionario(datos).subscribe(() => {
      this.funcionarioNoEncontrado = false;
      alert('Nuevo suario añadido');
      this.formFuncionario.reset();
      // Opcional: recargar tabla
=======
    this.ingresoService.crearOActualizarFuncionarioPerfil(datos).subscribe({
      next: () => {
        this.funcionarioNoEncontrado = false;
        this.snackBar.open('Funcionario registrado', 'Cerrar', { duration: 2000 });
        this.formFuncionario.reset();
        this.refresh$.next(); // ← recarga
      }
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
    });
  }

  eliminarFuncionario() {
<<<<<<< HEAD
  if (!this.funcionarioEncontrado) return;

  const confirmar = confirm(`¿Estás seguro que deseas eliminar al funcionario ${this.funcionarioEncontrado.nombre}?`);
  if (!confirmar) return;

  const rut = this.funcionarioEncontrado.rut;

    // Lógica real
    this.servicio.eliminarFuncionario(rut).subscribe(() => {
      this.snackBar.open('Funcionario eliminado correctamente', 'Cerrar', {
        duration: 1500,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-success']
      });

        this.funcionarioEncontrado = null;
        this.formEditarFuncionario.reset();
        this.valorBusqueda = '';
    });
  }

  //   eliminarFuncionario() {
  //   if (!this.funcionarioEncontrado) return;

  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     data: { mensaje: `¿Estás seguro que deseas eliminar al funcionario ${this.funcionarioEncontrado.nombre}?` }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       const rut = this.funcionarioEncontrado.rut;
  //       this.servicio.eliminarFuncionario(rut).subscribe(() => {
  //         this.snackBar.open('Funcionario eliminado correctamente', 'Cerrar', {
  //           duration: 3000,
  //           horizontalPosition: 'right',
  //           verticalPosition: 'bottom',
  //           panelClass: ['snackbar-success']
  //         });

  //         this.funcionarioEncontrado = null;
  //         this.formEditarFuncionario.reset();
  //         this.valorBusqueda = '';
  //       });
  //     }
  //   });
  // }

=======
    if (!this.funcionarioEncontrado) return;

    const rut = this.funcionarioEncontrado.rut;
    this.ingresoService.eliminarFuncionarioPerfil(rut).subscribe({
      next: () => {
        this.snackBar.open('Funcionario eliminado', 'Cerrar', { duration: 1500 });
        this.funcionarioEncontrado = null;
        this.formEditarFuncionario.reset();
        this.valorBusqueda = '';
        this.refresh$.next(); // ← recarga
      }
    });
  }

>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
  formatearRut() {
    // Elimina puntos y guión
    let rut = this.valorBusqueda.replace(/[^0-9kK]/g, '').toUpperCase();

    // Si tiene menos de 2 dígitos, no se puede formatear
    if (rut.length < 2) {
      this.valorBusqueda = rut;
      return;
    }

    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);

    // Agrega puntos cada 3 cifras desde el final
    const cuerpoFormateado = cuerpo
      .split('')
      .reverse()
      .join('')
      .match(/.{1,3}/g)!
      .join('.')
      .split('')
      .reverse()
      .join('');

    this.valorBusqueda = `${cuerpoFormateado}-${dv}`;
  }

  validarRut(rutConFormato: string): boolean {
    const rutLimpio = rutConFormato.replace(/\./g, '').replace('-', '').toUpperCase();

    if (!/^[0-9]+[0-9K]$/.test(rutLimpio)) return false;

    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);

    // Rechazar RUTs con cuerpo de solo ceros
    if (/^0+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvFinal = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dv === dvFinal;
  }




}
