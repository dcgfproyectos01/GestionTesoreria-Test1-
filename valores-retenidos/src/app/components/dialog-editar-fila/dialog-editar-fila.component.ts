import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { finalize, forkJoin } from 'rxjs';
import { IngresoFuncionarioService } from '../../services/ingreso-funcionario.service';
@Component({
  selector: 'app-dialog-editar-fila',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './dialog-editar-fila.component.html'
})
export class DialogEditarFilaComponent implements OnInit {
  form: FormGroup;

  conceptos: any[] = [];

  gradosFuncionario: any[] = []

  motivosPago: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<DialogEditarFilaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private IngresoFuncionarioService: IngresoFuncionarioService
  ) {
    this.form = this.fb.group({
      rutFuncioario: [data.funcionario.rut, [Validators.required, Validators.minLength(3)]],
      nombreFuncionario: [data.funcionario.nombre, [Validators.required, Validators.minLength(3)]],
      gradoFuncionario: [data.funcionario.grado, Validators.required],
      motivoBloqueo: [data.motivoBloqueo, Validators.required],
      concepto: [data.conceptoId, Validators.required],
      ncuDOE: [data.ncuDOE, [Validators.required, Validators.minLength(2)]],
      observacionesFuncionario: [data.observaciones, [Validators.required, Validators.minLength(2)]],
      periodoRemuneracion: [this.convertirFecha(data.periodoFecha), Validators.required],
      motivoPago: [data.motivoPagoID, Validators.required],
      montoRemuneracion: [data.montoRemuneracion, Validators.required]
    });
    console.log('Datos recibidos para editar:', data);
    //console.log('Valor crudo TIPO REMUNERACION:', data['TIPO REMUNERACION']);
  }

  ngOnInit(): void {   
    this.conceptos = this.data.infoGeneral.conceptos
    this.gradosFuncionario = this.data.infoGeneral.gradosFuncionario
    this.motivosPago = this.data.infoGeneral.motivosPago
    // forkJoin({
    //   grados: this.IngresoFuncionarioService.getGrados(),
    //   conceptos: this.IngresoFuncionarioService.getConceptos(),
    //   motivosPago: this.IngresoFuncionarioService.getMotivosPago()
    // }).subscribe({
    //   next: ({ grados, conceptos, motivosPago }) => {
    //     //
    //     console.log(grados)
    //     console.log(conceptos)
    //     console.log(motivosPago)
    //     //

    //     this.conceptos = conceptos
    //     this.gradosFuncionario = grados
    //     this.motivosPago = motivosPago
    //   },
    //   error: (err) => {
    //     console.error('Error en la carga inicial', err);
    //   }
    // });
  }
  
  // normalizarMotivoPago(valor: string): string {
  //   if (!valor) return '';

  //   const texto = valor.trim().toUpperCase();

  //   if (texto.includes('1RA') || texto.includes('1°')) return '1° Línea';
  //   if (texto.includes('2DA') || texto.includes('2°')) return '2° Línea';
  //   if (texto.includes('RENOVACION')) return 'Renovación';

  //   return '';
  // }

  // normalizarConcepto(valor: string): string {
  //   if (!valor) return '';

  //   const texto = valor.trim().toLowerCase();

  //   // Diccionario de sinónimos o abreviaciones comunes
  //   const equivalencias: { [clave: string]: string } = {
  //     'dep total': 'Depósito total',
  //     'deposito total': 'Depósito total',
  //     'caja': 'Caja',
  //     'bono escolar': 'Bono escolar',
  //     'aguinaldo fiestas patrias': 'Aguinaldo Fiestas Patrias',
  //     'aguinaldo navidad': 'Aguinaldo Navidad',
  //     'bono vacaciones': 'Bono Vacaciones',
  //     'bono especial': 'Bono Especial',
  //     'asignacion familiar': 'Asignación Familiar'
      
  //   };

  //   // Limpieza adicional para evitar errores por puntos, comas, tildes, etc.
  //   const key = texto
  //     .normalize('NFD')
  //     .replace(/[\u0300-\u036f]/g, '') // quitar tildes
  //     .replace(/[^\w\s]/gi, '')        // quitar puntuación
  //     .trim();

  //     if (!equivalencias[key]) {
  //     console.warn(`Concepto no reconocido: "${valor}" → clave: "${key}"`);
  //   }


  //   return equivalencias[key] || '';



  // }

  // normalizarGrado(valor: string): number | null {
  //   if (!valor) return null;
  //   const texto = valor.trim().toLowerCase();

  //   const match = this.gradosFuncionario.find(g => 
  //     texto.includes(g.nombre.toLowerCase().split('. ')[1]) || 
  //     texto.includes(g.nombre.toLowerCase())
  //   );

  //   return match?.id ?? null;
  // }

  // Función para convertir fecha tipo "12/2024" a YYYY-MM-DD
  convertirFecha(valor: string | Date): string {
    if (!valor) return '';

    if (valor instanceof Date) {
      return valor.toISOString().split('T')[0];
    }

    if (typeof valor === 'string') {
      const partes = valor.split('/');
      if (partes.length === 2) {
        const [mes, año] = partes;
        const fecha = new Date(+año, +mes - 1, 1);
        return fecha.toISOString().split('T')[0];
      }

      // Si es string tipo ISO
      const fechaISO = new Date(valor);
      if (!isNaN(fechaISO.getTime())) {
        return fechaISO.toISOString().split('T')[0];
      }
    }

    return '';
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
      console.log(this.form.value)
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}

