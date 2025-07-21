import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IngresoFuncionarioService } from '../../services/ingreso-funcionario.service';
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
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component'; // ajustar ruta si es necesario


@Component({
  selector: 'app-mantenedor',
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
  templateUrl: './mantenedor.component.html',
  styleUrls: ['./mantenedor.component.css']
})
export class MantenedorComponent implements OnInit {
  
  funcionarioEncontrado: any = null;

  formEditarFuncionario!: FormGroup;

  valorBusqueda = '';
  funcionarioNoEncontrado = false;

  dataSource = new MatTableDataSource<any>([]);
  formFuncionario!: FormGroup;

  roles = [
    { id: 'ADMIN', nombre: 'Administrador' },
    { id: 'DIGITADOR', nombre: 'Digitador' },
    { id: 'VALIDADOR', nombre: 'Validador' },
  ];

  areas = ['Análisis', 'Contabilidad', 'Pago'];

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

  // ✅ MODIFICADA: lógica completa del buscador
  buscarFuncionario() {
    const input = this.valorBusqueda.replace(/\./g, '').replace('-', '').toUpperCase().trim();

    // 🛑 1. Campo vacío
    if (!input) {
      this.snackBar.open('Por favor, ingrese un RUT para realizar la búsqueda', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });

      // Limpia toda la vista anterior
      this.funcionarioEncontrado = null;
      this.funcionarioNoEncontrado = false;
      this.formEditarFuncionario.reset();
      this.formFuncionario.reset();
      return;
    }

    // 🛑 2. Formato incorrecto (mínimo esperado)
    if (!this.esFormatoRutValido(input)) {
      this.snackBar.open('El formato del RUT no es válido', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });

      this.funcionarioEncontrado = null;
      this.funcionarioNoEncontrado = false;
      this.formEditarFuncionario.reset();
      this.formFuncionario.reset();
      return;
    }

    // 🛑 3. RUT inválido con DV o cuerpo 00000000
    if (!this.validarRut(this.valorBusqueda)) {
      this.snackBar.open('El RUT ingresado no es válido', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });

      this.funcionarioEncontrado = null;
      this.funcionarioNoEncontrado = false;
      this.formEditarFuncionario.reset();
      this.formFuncionario.reset();
      return;
    }

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
    this.dataSource.filterPredicate = (data: any, f: string) =>
      data.rutFuncioario?.toLowerCase().includes(f) ||
      data.nombreFuncionario?.toLowerCase().includes(f) ||
      data.ncuDOE?.toString().includes(f);

    this.dataSource.filter = input;
  }



  guardarCambiosFuncionario() {
    if (this.formEditarFuncionario.invalid) return;

    const datosEditados = this.formEditarFuncionario.value;

    // Aquí iría el servicio real de actualización
    this.servicio.actualizarFuncionario(datosEditados).subscribe(() => {
      alert('Cambios guardados correctamente');
      // Opcional: recargar tabla o datos
    });
  }

  guardarNuevoFuncionario() {
    if (this.formFuncionario.invalid) return;

    const datos = this.formFuncionario.value;

    // Aquí debes llamar al servicio real que registra el funcionario
    this.servicio.crearFuncionario(datos).subscribe(() => {
      this.funcionarioNoEncontrado = false;
      alert('Nuevo suario añadido');
      this.formFuncionario.reset();
      // Opcional: recargar tabla
    });
  }

  eliminarFuncionario() {
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
