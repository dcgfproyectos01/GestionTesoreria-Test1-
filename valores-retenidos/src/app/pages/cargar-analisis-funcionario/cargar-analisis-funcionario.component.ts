import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DialogEditarFilaComponent } from '../../components/dialog-editar-fila/dialog-editar-fila.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-cargar-analisis-funcionario',
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    ReactiveFormsModule, MatTableModule, 
    MatButtonModule, MatInputModule,
    MatIconModule, MatPaginatorModule, 
    MatSortModule, MatFormFieldModule, 
    MatCardModule, MatDialogModule,
    SpinnerComponent
  ],
  templateUrl: './cargar-analisis-funcionario.component.html',
  styleUrl: './cargar-analisis-funcionario.component.css'
})


export class CargarAnalisisFuncionarioComponent implements OnInit, AfterViewInit, AfterViewChecked {

  //AQUI VAN LAS VARIABLES, DESPUÉS DE LA CLASE
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('inputArchivoExcel') inputArchivoExcelRef!: any;
  @ViewChildren('filaExcel') filasExcel!: QueryList<ElementRef>;

  archivoExcel: File | null = null;
  nombreArchivoExcel: string = '';
  nombresHojas: string[] = [];
  nombreHojaSeleccionada: string = '';
  workbookExcel: XLSX.WorkBook | null = null;
  datosExcel: any[] = [];
  columnasExcel: string[] = [];
  loadingExcel: boolean = false;
  camposVacios: { fila: number; columnas: string[] }[] = [];
  totalCamposVacios: number = 0;
  filaSeleccionada: number | null = null;
  camposExcedidos: { fila: number; columnas: string[] }[] = [];
  totalCamposExcedidos: number = 0;




  ngOnInit(): void {}

  //PAGINATOR
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //PAGINATOR
  ngAfterViewChecked() {
    if (this.dataSource.paginator !== this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.dataSource.sort !== this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  constructor(private dialog: MatDialog, private cdRef: ChangeDetectorRef) {}

  editarFila(index: number): void {
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    const absoluteIndex = pageIndex * pageSize + index;

    const fila = this.datosExcel[absoluteIndex];
    console.log('Fila enviada al modal:', fila); // ✅ ahora es correcta

    const dialogRef = this.dialog.open(DialogEditarFilaComponent, {
      width: '50vw',
      maxWidth: '95vw',
      autoFocus: false,
      data: { ...fila }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.datosExcel[absoluteIndex] = resultado;
        this.dataSource.data = [...this.datosExcel]; // Refresca la tabla
      }
    });
  }


  scrollToFila(index: number): void {
    this.filaSeleccionada = index;

    const pageSize = this.paginator.pageSize;
    const pageIndex = Math.floor(index / pageSize);

    if (this.paginator.pageIndex !== pageIndex) {
      this.paginator.pageIndex = pageIndex;
      this.dataSource.paginator = this.paginator;

      // Forzar detección de cambios para evitar ExpressionChangedAfterItHasBeenCheckedError
      this.cdRef.detectChanges();
    }

    setTimeout(() => {
      const relativeIndex = index % pageSize;
      const filaArray = this.filasExcel?.toArray();
      const fila = filaArray?.[relativeIndex];

      if (fila?.nativeElement) {
        fila.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        console.warn(`La fila ${relativeIndex} no se encontró para scrollIntoView`);
      }
    }, 200);
  }

  
  isFilaResaltada(i: number): boolean {
  if (!this.paginator || this.filaSeleccionada === null) return false;

  const absoluteIndex = i + this.paginator.pageIndex * this.paginator.pageSize;
  return absoluteIndex === this.filaSeleccionada;
}

  
  onArchivoExcelSeleccionado(event: Event): void {
    this.camposVacios = [];
    this.totalCamposVacios = 0;

    this.loadingExcel = true;
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name.toLowerCase();

      // ⚠️ Validar extensión
      const isExcel = fileName.endsWith('.xls') || fileName.endsWith('.xlsx');

      // También podrías validar tipo MIME si fuera confiable
      // const isExcelMime = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      if (!isExcel) {
        alert('Por favor selecciona un archivo Excel válido (.xls o .xlsx)');
        this.loadingExcel = false;
        this.inputArchivoExcelRef.nativeElement.value = '';
        return;
      }

      this.archivoExcel = file;
      this.nombreArchivoExcel = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        this.workbookExcel = workbook;
        this.nombresHojas = workbook.SheetNames;
        this.nombreHojaSeleccionada = this.nombresHojas[0];

        this.cargarHojaExcel(this.nombreHojaSeleccionada);
      };
      reader.readAsArrayBuffer(file);
    }
  }


  cargarHojaExcel(nombreHoja: string): void {

    if (!this.workbookExcel) return;
    this.camposVacios = [];
    this.totalCamposVacios = 0;
    this.camposExcedidos = [];
    this.totalCamposExcedidos = 0;

    const hoja = this.workbookExcel.Sheets[nombreHoja];
    const rawData = XLSX.utils.sheet_to_json(hoja, { header: 1, defval: '', raw: false }) as string[][];

    if (rawData.length < 2) return;

    const allHeaders = rawData[1].map(h => h?.toString().trim() || '');
    const dataRows = rawData.slice(2);

    const validHeaderIndexes: number[] = [];

    allHeaders.forEach((header, index) => {
      const isNonEmptyName = header && !header.includes('__EMPTY');
      const hasValues = dataRows.some(row => row[index]?.toString().trim());
      if (isNonEmptyName && hasValues && validHeaderIndexes.length < 10) {
        validHeaderIndexes.push(index);
      }
    });

    this.columnasExcel = validHeaderIndexes.map(i => allHeaders[i]);

    this.datosExcel = dataRows.map(row => {
      const obj: any = {};
      validHeaderIndexes.forEach(i => {
        obj[allHeaders[i]] = row[i] ?? '';
      });
      return obj;
    });

    this.displayedColumns = [...this.columnasExcel, 'acciones'];
    this.dataSource.data = [...this.datosExcel];
    this.dataSource._updateChangeSubscription();

    //SPINNER DE CARGA
    setTimeout(() => {
      this.loadingExcel = false;
    }, 300);
    


  this.datosExcel.forEach((fila, filaIndex) => {
    const columnasVacias: string[] = [];
    const columnasExcedidas: string[] = [];

    this.columnasExcel.forEach(columna => {
      const valor = fila[columna];

      // Valida vacíos
      if (valor === null || valor === undefined || valor.toString().trim() === '') {
        columnasVacias.push(columna);
      }

      // Valida longitud > 50
      if (valor && valor.toString().length > 50) {
        columnasExcedidas.push(columna);
      }
    });

    if (columnasVacias.length > 0) {
      this.camposVacios.push({
        fila: filaIndex + 1,
        columnas: columnasVacias
      });
      this.totalCamposVacios += columnasVacias.length;
    }

    if (columnasExcedidas.length > 0) {
      this.camposExcedidos.push({
        fila: filaIndex + 1,
        columnas: columnasExcedidas
      });
      this.totalCamposExcedidos += columnasExcedidas.length;
    }
  });

    console.log(this.camposVacios)
  }

  cerrarExcelCargado(): void {
    this.nombreArchivoExcel = '';
    this.nombresHojas = [];
    this.nombreHojaSeleccionada = '';
    this.dataSource.data = [];
    this.datosExcel = [];
    this.columnasExcel = [];
    this.displayedColumns = [];
    this.workbookExcel = null;
    this.archivoExcel = null;
    this.camposVacios = [];
    this.totalCamposVacios = 0;
    this.filaSeleccionada = null;
    this.totalCamposExcedidos= 0;
    this.camposExcedidos = [];


    if (this.inputArchivoExcelRef?.nativeElement) {
      this.inputArchivoExcelRef.nativeElement.value = '';
      }

    console.log('Campos excedidos al cerrar:', this.camposExcedidos); // debe mostrar []

    }

  guardarExcel(): void {
    if (!this.datosExcel.length) return;

    const tieneDatos = this.datosExcel.some(fila => fila['RUT'] || fila['NOMBRE COMPLETO'] || fila['GRADO']);
    if (!tieneDatos) {
      alert('El archivo no contiene datos válidos para guardar');
      return;
    }

    console.log('Datos de Excel a guardar:', this.datosExcel);
    alert('Datos guardados correctamente');
  }

  eliminarFila(index: number): void {
    if (confirm('¿Estás seguro que deseas eliminar esta fila?')) {
      this.datosExcel.splice(index, 1);
      this.dataSource.data = [...this.datosExcel];
    }
  }


}