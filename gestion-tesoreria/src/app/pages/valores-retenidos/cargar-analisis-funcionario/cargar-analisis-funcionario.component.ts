import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DialogEditarFilaComponent } from '../../../components/valores-retenidos/dialog-editar-fila/dialog-editar-fila.component';
import { ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { SpinnerComponent } from '../../../components/valores-retenidos/spinner/spinner.component';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IngresoFuncionarioService } from '../../../services/ingreso-funcionario.service';


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
    SpinnerComponent,NgFor
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



  filaSeleccionada: number | null = null;
  camposExcedidos: { fila: number; columnas: string[] }[] = [];
  totalCamposExcedidos: number = 0;

  //////////////////////////OnArchivoSeleccionado///////////////////////////////////
  camposVacios: { fila: number; columnas: string[] }[] = [];
  totalCamposVacios: number = 0;
  loadingExcel: boolean = false;


  /////////////////////////////////////////////////////////////
  analisisForm: FormGroup;
  gradoFuncionario: any[] = [];
  conceptos: any[] = [];
  motivoPago: any[] = [];

  /////////////////////////////////////////////////////////////
  indiceEnEdicion: number | null = null;
  backupEdit?: any; 


  // mapas para resolver texto → id
  private mapGrado = new Map<string, number>();
  private mapConcepto = new Map<string, number>();
  private mapMotivoPago = new Map<string, number>();

  ngOnInit(): void {
      forkJoin({
      grados: this.ingresoSrv.getGrados(),
      conceptos: this.ingresoSrv.getConceptos(),
      motivos: this.ingresoSrv.getMotivosPago()
    }).subscribe({
      next: ({grados, conceptos, motivos}) => {
        grados.forEach((g: any) => this.mapGrado.set(this.norm(g.nombre_grado), g.id_grado));
        conceptos.forEach((c: any) => this.mapConcepto.set(this.norm(c.nombre_concepto), c.id_concepto));
        motivos.forEach((m: any) => this.mapMotivoPago.set(this.norm(m.nombre_motivo_pago), m.id_motivopago));
      },
      error: () => this.snack.open('No se pudieron cargar catálogos', 'Cerrar', {duration: 3000})
    });
  }

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

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog, 
    private cdRef: ChangeDetectorRef,
    private snack: MatSnackBar,
    private ingresoSrv: IngresoFuncionarioService,

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
        periodoRemuneracion: ['', Validators.required],
        motivoPago: ['', Validators.required],
        montoRemuneracion: ['', Validators.required]
      });
  }

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
    // Limpia errores anteriores
    this.camposVacios = [];
    this.totalCamposVacios = 0;
    this.loadingExcel = true;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name.toLowerCase();
      console.log("Archivo excel",file)
      // Validación: debe ser .xls o .xlsx
      const isExcel = fileName.endsWith('.xls') || fileName.endsWith('.xlsx');
      if (!isExcel) {
        alert('Archivo inválido');
        this.loadingExcel = false;
        this.inputArchivoExcelRef.nativeElement.value = '';
        return;
      }

      // Guarda el archivo y nombre
      this.archivoExcel = file;
      this.nombreArchivoExcel = file.name;

      // Lee el archivo como ArrayBuffer para procesarlo
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        this.workbookExcel = workbook;
        this.nombresHojas = workbook.SheetNames;
        this.nombreHojaSeleccionada = this.nombresHojas[0];
        console.log("workbookExcel",this.workbookExcel)
        console.log("nombresHojas",this.nombresHojas)
        console.log("nombreHojaSeleccionada",this.nombreHojaSeleccionada)
        // Carga la primera hoja automáticamente
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
    console.log("datosExcel:",this.datosExcel)
    this.displayedColumns = [...this.columnasExcel];
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

  eliminarFila(index: number): void {
    if (confirm('¿Estás seguro que deseas eliminar esta fila?')) {
      this.datosExcel.splice(index, 1);
      this.dataSource.data = [...this.datosExcel];
    }
  }
  

  /////////////////////////////////////////////////// SEGUNDA TABLA ///////////////////////////////////////////////////

  actualizarContadoresValidacion(): void {
    this.camposVacios = [];
    this.totalCamposVacios = 0;
    this.camposExcedidos = [];
    this.totalCamposExcedidos = 0;

    this.datosExcel.forEach((fila, filaIndex) => {
      const columnasVacias: string[] = [];
      const columnasExcedidas: string[] = [];

      this.columnasExcel.forEach(columna => {
        const valor = fila[columna];
        if (valor === null || valor === undefined || valor.toString().trim() === '') {
          columnasVacias.push(columna);
        }
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
  }


  editarTablaCargada(index: number){
    console.log(("Haz hecho click en editar, fila: " + (index+1)))
    this.indiceEnEdicion = index; // activa modo edición para esa fila
    this.backupEdit = structuredClone
      ? structuredClone(this.datosExcel[index])
      : JSON.parse(JSON.stringify(this.datosExcel[index]));
  }

  salirEdicion() {
    this.actualizarContadoresValidacion();
    this.indiceEnEdicion = null; // ngModel ya dejó los cambios
    this.backupEdit = undefined;
  }

  guardarEdicion(evt?: Event) {
    evt?.preventDefault();
    evt?.stopPropagation();

    this.indiceEnEdicion = null;
    this.backupEdit = undefined;

    // Fuerza repintado
    this.actualizarContadoresValidacion();
    this.datosExcel = [...this.datosExcel];
    this.dataSource.data = [...this.datosExcel];
  }

  cancelarEdicion(evt?: Event) {
    evt?.preventDefault();
    evt?.stopPropagation();

    if (this.indiceEnEdicion !== null && this.backupEdit) {
      const i = this.indiceEnEdicion;
      const original = structuredClone
        ? structuredClone(this.backupEdit)
        : JSON.parse(JSON.stringify(this.backupEdit));

      // Restaura el registro y cambia la referencia del array
      this.datosExcel.splice(i, 1, original);
      this.datosExcel = [...this.datosExcel];
      this.dataSource.data = [...this.datosExcel];
    }

    this.indiceEnEdicion = null;
    this.backupEdit = undefined;
    this.actualizarContadoresValidacion();
  }

  onRowFocusOut(event: FocusEvent, index: number, rowEl: HTMLElement) {
    const next = event.relatedTarget as Node | null;
    // ¿el foco salió fuera de ESTA fila?
    if (!next || !rowEl.contains(next)) {
      this.salirEdicion();
    }
  }

  // opcional: cancelar con ESC
  onKeydownEsc(evt: KeyboardEvent) {
    if (evt.key === 'Escape' && this.indiceEnEdicion !== null && this.backupEdit) {
      this.datosExcel[this.indiceEnEdicion] = structuredClone(this.backupEdit);
      this.salirEdicion();
    }
  }

  
  eliminarFilaCargada(index: number){
    console.log(("Haz hecho click en editar, fila: " + (index+1)))
    const confirmado = confirm(`¿Deseas eliminar el registro N° ${index + 1}?`);
    if (confirmado) {
      this.datosExcel.splice(index, 1); // elimina la fila
      this.dataSource.data = [...this.datosExcel]; // actualiza la tabla
      this.actualizarContadoresValidacion(); // opcional: si quieres volver a contar errores
    }
  }

    //Mostrar alerta con MatSnack
  mostrarNotificacionSnackBar(mensaje: string) {

    this.snack.open(mensaje, 'Cerrar', {
      duration: 4000, // duración en milisegundos
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-custom']
    });

  }





    //ENVIO PARA LA BASE DE DATOS

  // --- Config por defecto ---
  private readonly GRADO_SIN_GRADO_ID = 18; // id de "Sin grado" en tu BD

  // Resolver grado: vacío => 18; texto => catálogo; si no existe => error
  private resolveGradoId(gradoTxt: any): number {
    const raw = (gradoTxt ?? '').toString().trim();
    const norm = this.norm(raw);

    // 1) Si viene vacío => "Sin grado"
    if (!norm) return this.GRADO_SIN_GRADO_ID;

    // 2) Si viene numérico en texto (ej: "18")
    const n = parseInt(raw, 10);
    if (Number.isFinite(n)) {
      // si el catálogo tiene ese id, úsalo
      for (const [k, v] of this.mapGrado.entries()) {
        if (v === n) return v;
      }
      // probar también "Grado X" por si en Excel viene así
      const mapeado = this.mapGrado.get(this.norm(`Grado ${n}`));
      if (mapeado) return mapeado;
    }

    // 3) Intentar por nombre exacto en catálogo
    const id = this.mapGrado.get(norm);
    if (id) return id;

    // 4) No se pudo resolver
    throw new Error(`GRADO "${raw}" no coincide con catálogo`);
  }

  // Intenta resolver el motivo de pago a partir del texto del Excel
  private resolveMotivoPagoId(txt: any): number {
    const raw  = (txt ?? '').toString();
    const norm = this.norm(raw);

    // 1) intento directo contra el catálogo normalizado
    const direct = this.mapMotivoPago.get(norm);
    if (direct) return direct;

    // 2) heurísticas comunes
    // Renovación
    if (/(renov)/i.test(raw) || norm.includes('renov')) {
      // busca una entrada que contenga "renov"
      for (const [k, v] of this.mapMotivoPago.entries()) {
        if (k.includes('renov')) return v;
      }
    }

    // 1° línea (1ra, 1, primera, con/ sin "haberes", con/ sin puntos)
    if (/\b(1|1ra|1er|primera)\b/.test(norm) || /1\s*linea/.test(norm)) {
      for (const [k, v] of this.mapMotivoPago.entries()) {
        if (k.includes('1') && k.includes('linea')) return v;
      }
    }

    // 2° línea (2da, 2, segunda…)
    if (/\b(2|2da|segunda)\b/.test(norm) || /2\s*linea/.test(norm)) {
      for (const [k, v] of this.mapMotivoPago.entries()) {
        if (k.includes('2') && k.includes('linea')) return v;
      }
    }

    // Si nada coincidió, error claro
    throw new Error(`MOTIVO REMUNERACION "${raw}" no coincide con catálogo`);
  }

  // Helpers chiquitos  
  private norm(s: string | null | undefined): string {
    return (s ?? '')
      .toString()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // sin tildes
      .replace(/[°ºª.]/g, ' ')                           // sin símbolos/ puntos
      .replace(/\bhaberes\b/gi, ' ')                     // quita "HABERES"
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  private toPeriodoISO(v: string): string {
    // "5/1/25" o "05/2025" -> "2025-05-01" (ajústalo a tu formato real)
    if (!v) return '';
    // intenta "MM/YYYY"
    const mmYYYY = v.match(/^(\d{1,2})\/(\d{2,4})$/);
    if (mmYYYY) {
      const mm = mmYYYY[1].padStart(2, '0');
      const yyyy = mmYYYY[2].length === 2 ? '20' + mmYYYY[2] : mmYYYY[2];
      return `${yyyy}-${mm}-01`;
    }
    // si ya viene YYYY-MM o YYYY-MM-DD
    if (/^\d{4}-\d{2}(-\d{2})?$/.test(v)) return v.length === 7 ? `${v}-01` : v;
    return '';
  }

  private moneyToNumber(v: any): number {
    if (v == null) return 0;
    // quita $ y separadores de miles, cambia coma por punto
    return Number(v.toString().replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')) || 0;
  }

  // Interpreta $1,188,975 o 1.188.975 como 1188975
  private moneyToInt(v: any): number {
    if (v == null) return 0;
    const onlyDigits = v.toString().replace(/\D/g, ''); // solo dígitos
    return Number(onlyDigits) || 0;
  }


  private toNumber(v: any): number {
    if (v == null) return 0;
    const s = String(v).replace(/\./g, '').replace(',', '.').trim();
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  }

  private toInt(v: any): number | null {
    const n = parseInt(String(v), 10);
    return Number.isFinite(n) ? n : null;
  }

  private parsePeriodoExcel(v: string): string {
    // acepta formatos tipo "5/1/25" o "05/2025" o "5/2025"
    if (!v) return '';
    const parts = v.split(/[\/\-]/).map(p => p.trim());
    // elegimos último como año, primero como mes
    let mes = Number(parts[0]);
    let anio = parts[parts.length - 1];
    let y = Number(anio.length === 2 ? '20' + anio : anio);
    if (!mes || !y) return '';
    // YYYY-MM-01
    const mm = String(mes).padStart(2, '0');
    return `${y}-${mm}-01`;
  }

  private cleanRut(rut: string): string {
    return (rut ?? '').toString().replace(/[^\dkK]/g, '').toUpperCase();
  }

  private require<T>(val: T | null | undefined, msg: string): T {
    if (val === null || val === undefined || val === '' as any) {
      throw new Error(msg);
    }
    return val as T;
  }

  enviarDatos2() {
    if (!this.datosExcel?.length) {
      this.snack.open('No hay filas para enviar', 'Cerrar', { duration: 3000 });
      return;
    }

    const payloads: any[] = [];
    const errores: string[] = [];

    this.datosExcel.forEach((row, idx) => {
      try {
        // OJO: claves EXACTAS como vienen del Excel
        const rutRaw        = this.require(row['RUT'],                   `Fila ${idx + 1}: RUT vacío`);
        const nombre        = this.require(row['NOMBRE COMPLETO'],      `Fila ${idx + 1}: NOMBRE vacío`);
        const gradoTxt      = row['GRADO']; // <-- ya NO se requiere: puede venir vacío
        const conceptoTxt   = this.require(row['CONCEPTO'],             `Fila ${idx + 1}: CONCEPTO vacío`);
        const motivoBloqueo = row['MOTIVO BLOQUEO'] ?? '';
        const periodoTxt    = this.require(row['PERIODO REMUNERACION'], `Fila ${idx + 1}: PERIODO REMUNERACION vacío`);
        const motivoPagoTxt = this.require(row['TIPO REMUNERACION'],    `Fila ${idx + 1}: TIPO REMUNERACION vacío`);
        const montoTxt      = this.require(row['MONTO'],                `Fila ${idx + 1}: MONTO vacío`);
        const observaciones = row['OBSERVACIONES'] ?? '';
        const ncuTxt        = row['N.C.U. DOE'] ?? row['N.C.U DOE'] ?? row['NCU DOE'] ?? '';

        // ---- mapear a IDs del catálogo ----
        // GRADO: opcional; si viene vacío => 18 (Sin grado)
        const gradoId = this.resolveGradoId(gradoTxt);

        const conceptoId   = this.mapConcepto.get(this.norm(conceptoTxt));
        if (!conceptoId) throw new Error(`Fila ${idx + 1}: CONCEPTO "${conceptoTxt}" no coincide con catálogo`);

        const motivoPagoId = this.resolveMotivoPagoId(motivoPagoTxt);

        // ---- normalizar periodo y monto ----
        const periodoISO = this.parsePeriodoExcel(periodoTxt);
        if (!periodoISO) throw new Error(`Fila ${idx + 1}: PERIODO REMUNERACION inválido`);

        const monto = this.moneyToInt(montoTxt);

        // ---- payload final ----
        const payload = {
          funcionario: {
            rut: this.cleanRut(rutRaw),
            nombre,
            grado: gradoId
          },
          concepto: conceptoId,
          ncu_doe: Number(ncuTxt) || 0,
          motivo_bloqueo: motivoBloqueo,
          observaciones_analisis: observaciones,
          periodos: [
            {
              periodo_remuneracion: periodoISO,
              motivo_pago: motivoPagoId,
              monto
            }
          ]
        };

        payloads.push(payload);

      } catch (e: any) {
        errores.push(e.message || `Fila ${idx + 1}: error desconocido`);
      }
    });

    if (errores.length) {
      this.snack.open(errores.slice(0, 3).join(' • '), 'Cerrar', { duration: 5000 });
      console.warn('Errores de validación:', errores);
      return;
    }

    // Enviar en paralelo
    forkJoin(payloads.map(p => this.ingresoSrv.crearIngreso(p)))
      .pipe(finalize(() => {/* spinner off si quieres */}))
      .subscribe({
        next: (resps: any[]) => this.snack.open(`Se guardaron ${resps.length} registros`, 'Cerrar', { duration: 3000 }),
        error: (err) => {
          console.error(err);
          this.snack.open('Error al guardar algunos registros', 'Cerrar', { duration: 4000 });
        }
      });
  }


  enviarDatos1() {
    console.log('Haz hecho click en botón de EnviarDatos de tabla');

    this.datosExcel.forEach((element) => {
      console.log('element', element);

      // Usa SIEMPRE corchetes para columnas con espacios o puntos
      const rut               = element['RUT'] ?? '';
      const nombre            = element['NOMBRE COMPLETO'] ?? element['NOMBRE'] ?? '';
      const gradoTxt          = element['GRADO'] ?? '';
      const concepto          = element['CONCEPTO'] ?? '';
      const motivoBloqueo     = element['MOTIVO BLOQUEO'] ?? '';
      const periodoTxt        = element['PERIODO REMUNERACION'] ?? '';
      const motivoPagoTxt     = element['TIPO REMUNERACION'] ?? element['MOTIVO REMUNERACION'] ?? '';
      const montoTxt          = element['MONTO'];
      const observaciones     = element['OBSERVACIONES'] ?? '';
      const ncuDoeTxt         = element['N.C.U. DOE'] ?? element['N.C.U DOE'] ?? element['NCU DOE'] ?? '';

      // si GRADO/TIPO REMUNERACION vienen con texto, aquí podrías mapear a id
      // const gradoId = this.obtenerIdGradoDesdeTexto(gradoTxt);
      // const motivoPagoId = this.obtenerIdMotivoPagoDesdeTexto(motivoPagoTxt);

      const payload = {
        funcionario: {
          rut: rut,
          nombre: nombre,
          // si es numérico:
          // grado: this.toInt(gradoTxt),
          // si es texto y necesitas id:
          grado: null, // <-- o this.obtenerIdGradoDesdeTexto(gradoTxt)
        },
        concepto: concepto,
        ncu_doe: this.toInt(ncuDoeTxt),
        motivo_bloqueo: motivoBloqueo,
        observaciones_analisis: observaciones,
        periodos: [
          {
            periodo_remuneracion: this.toPeriodoISO(periodoTxt),
            // si tienes catálogo y necesitas id:
            // motivo_pago: motivoPagoId,
            // si el backend acepta el texto:
            motivo_pago: motivoPagoTxt,
            monto: this.toNumber(montoTxt),
          },
        ],
      };

      console.log('Payload:', payload);

      // Llamada al backend (descomenta cuando quieras probar)
      // this.ingresoSrv.crearIngreso(payload).subscribe({
      //   next: (res) => this.mostrarNotificacionSnackBar(res.message),
      //   error: (err) => {
      //     console.error('Error al guardar:', err);
      //     this.mostrarNotificacionSnackBar('Error al guardar el ingreso');
      //   }
      // });
    });
  }

}