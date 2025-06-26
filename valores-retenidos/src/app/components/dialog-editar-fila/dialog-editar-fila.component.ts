import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-editar-fila',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './dialog-editar-fila.component.html'
})
export class DialogEditarFilaComponent {
  form: FormGroup;

  conceptos: string[] = [
    'Depósito total',
    'Caja',
    'Bono escolar',
    'Aguinaldo Fiestas Patrias',
    'Aguinaldo Navidad',
    'Bono Vacaciones',
    'Bono Especial',
    'Asignación Familiar'
  ];

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
    { id: 18, nombre: '18. Sin grado' }
  ];



  constructor(
    private dialogRef: MatDialogRef<DialogEditarFilaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      rutFuncioario: [data['RUT'] || '', [Validators.required, Validators.minLength(3)]],
      nombreFuncionario: [data['NOMBRE COMPLETO'] || '', [Validators.required, Validators.minLength(3)]],
      gradoFuncionario: [this.normalizarGrado(data['GRADO']) ?? '', Validators.required],
      motivoBloqueo: [data['MOTIVO BLOQUEO'] || '', Validators.required],
      concepto: [this.normalizarConcepto(data['CONCEPTO']) || '', Validators.required],
      ncuDOE: [data['N.C.U. DOE'] || '', [Validators.required, Validators.minLength(2)]],
      observacionesFuncionario: [data['OBSERVACIONES'] || '', [Validators.required, Validators.minLength(2)]],
      periodoRemuneracion: [this.convertirFecha(data['FECHA'] || ''), Validators.required],
      motivoPago: [this.normalizarMotivoPago(data['TIPO REMUN']) || '', Validators.required],
      montoRemuneracion: [data['MONTO'] || '', Validators.required],

    });
    console.log('Valor crudo TIPO REMUNERACION:', data['TIPO REMUNERACION']);

  }
  
  normalizarMotivoPago(valor: string): string {
    if (!valor) return '';

    const texto = valor.trim().toUpperCase();

    if (texto.includes('1RA') || texto.includes('1°')) return '1° Línea';
    if (texto.includes('2DA') || texto.includes('2°')) return '2° Línea';
    if (texto.includes('RENOVACION')) return 'Renovación';

    return '';
  }

  normalizarConcepto(valor: string): string {
    if (!valor) return '';

    const texto = valor.trim().toLowerCase();

    // Diccionario de sinónimos o abreviaciones comunes
    const equivalencias: { [clave: string]: string } = {
      'dep total': 'Depósito total',
      'deposito total': 'Depósito total',
      'caja': 'Caja',
      'bono escolar': 'Bono escolar',
      'aguinaldo fiestas patrias': 'Aguinaldo Fiestas Patrias',
      'aguinaldo navidad': 'Aguinaldo Navidad',
      'bono vacaciones': 'Bono Vacaciones',
      'bono especial': 'Bono Especial',
      'asignacion familiar': 'Asignación Familiar'
      
    };

    // Limpieza adicional para evitar errores por puntos, comas, tildes, etc.
    const key = texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quitar tildes
      .replace(/[^\w\s]/gi, '')        // quitar puntuación
      .trim();

      if (!equivalencias[key]) {
      console.warn(`Concepto no reconocido: "${valor}" → clave: "${key}"`);
    }


    return equivalencias[key] || '';



  }

  normalizarGrado(valor: string): number | null {
    if (!valor) return null;
    const texto = valor.trim().toLowerCase();

    const match = this.gradoFuncionario.find(g => 
      texto.includes(g.nombre.toLowerCase().split('. ')[1]) || 
      texto.includes(g.nombre.toLowerCase())
    );

    return match?.id ?? null;
  }



  // Función para convertir fecha tipo "12/2024" a YYYY-MM-DD
  convertirFecha(valor: string): string {
    const partes = valor?.split('/');
    if (partes.length === 2) {
      const [mes, año] = partes;
      const fecha = new Date(+año, +mes - 1, 1);
      return fecha.toISOString().split('T')[0];
    }
    return '';
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(/*this.form.value*/);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}

