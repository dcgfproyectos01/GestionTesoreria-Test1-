import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoFuncionarioService {
  private apiUrl = 'http://des.gestiontesoreria.carabineros.cl/api/valores_retenidos/';
  // private apiUrl = 'http://localhost:8000/api/common/ingresos/';


  constructor(private http: HttpClient) {}

<<<<<<< HEAD
=======



  ////////////////////////////////// API P7 //////////////////////////////////
  
  obtenerFuncionarioSegunRutP7(rut: string) {
    return this.http.get<any>(`${this.apiUrl}${this.limpiarRut(rut)}/datos-p7/`);
  }

  limpiarRut(rut: string): string {
    return rut.replace(/[^0-9Kk]/g, '').toUpperCase();
  }

  formatearRut(rut: string): string {
    rut = rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase();
    if (rut.length < 2) return rut;

    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);
    const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${cuerpoConPuntos}-${dv}`;
  }


  ////////////////////////////////// API P7 //////////////////////////////////




  // ingreso-funcionario.service.ts
  getAplicacionesPorRut(rut: string) {
    const clean = (rut || '').replace(/\./g, '').replace('-', '').toUpperCase();
    return this.http.get<any[]>(
      `${this.apiUrl}perfil/aplicaciones/by-rut/`,
      { params: { rut: clean } }
    );
  }

  // ingreso-funcionario.service.ts
  listarApps() {
    return this.http.get<any[]>(`${this.apiUrl}perfil/aplicaciones/`);  // [{id_aplicacion:1,nombre:"Valores Retenidos"}, ...]
  }

  getAppsDeRut(rut: string) {
    const clean = rut.replace(/\./g, '').replace('-', '').toUpperCase();
    return this.http.get(`${this.apiUrl}perfil/funcionarios/${clean}/apps/`); // {rut:"...", apps:[1,2]}
  }

  setAppsDeRut(rut: string, apps: number[]) {
    const clean = rut.replace(/\./g, '').replace('-', '').toUpperCase();
    return this.http.post(`${this.apiUrl}perfil/funcionarios/${clean}/apps/`, { apps });
  }


>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
  crearIngreso(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}ingresos/`, data);
  }

  // ✅ Método para listar los ingresos
  obtenerIngresos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}ingresos/`);
<<<<<<< HEAD

=======
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
  }

  // OBTENER MOTIVOS DE PAGOS
  getMotivosPago(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}motivos-pago/`);
  }

  // OBTENER GRADOS
  getGrados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}grados/`);
  }

  // OBTENER CONCEPTOS
  getConceptos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}conceptos/`);
  }

  // ✅ Eliminar ingreso (ruta correcta)
<<<<<<< HEAD
  eliminarIngreso(id: number): Observable<any> {
=======
  eliminarIngreso(id: number): Observable<any> { 
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
    return this.http.delete(`${this.apiUrl}ingresos/${id}/`);
  }

  // ✅ Actualizar ingreso (ruta correcta)
  actualizarIngreso(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}ingresos/${id}/`, data);
  }

  // (Opcional) Eliminar SOLO un periodo si tu API lo expone así:
  // elimina /api/valores_retenidos/periodos/{id}/
  eliminarPeriodo(idPeriodo: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}periodos/${idPeriodo}/`);
  }

  // ingreso-funcionario.service.ts
  actualizarPeriodo(idPeriodo: number, data: any) {
    return this.http.patch(`${this.apiUrl}periodos/${idPeriodo}/`, data);
  }


<<<<<<< HEAD
=======
  // --- Perfilamiento (usar misma base apiUrl) ---
  listarRolesPerfil() {
    return this.http.get<any[]>(`${this.apiUrl}roles/`);
  }

  obtenerFuncionarios() {
    return this.http.get(`${this.apiUrl}perfil/funcionarios/`);
  }

  buscarFuncionarioPerfil(rut: string) {
    const clean = rut.replace(/\./g, '').replace('-', '').toUpperCase();
    return this.http.get(`${this.apiUrl}perfil/funcionarios/by-rut/`, { params: { rut: clean } });
  }

  crearOActualizarFuncionarioPerfil(payload: any) {
    const body = { ...payload };
    body.rut = (body.rut || '').replace(/\./g, '').replace('-', '').toUpperCase();
    const t = (body.area_trabajo || '').toLowerCase();
    body.area_trabajo = t.startsWith('an') ? 'ANALISIS' : t.startsWith('co') ? 'CONTABILIDAD' : 'PAGO';
    return this.http.post(`${this.apiUrl}perfil/funcionarios/`, body);
  }

  actualizarFuncionarioPerfil(payload: any) {
    const rut = (payload.rut || '').replace(/\./g, '').replace('-', '').toUpperCase();
    const body = { ...payload, rut };
    const t = (body.area_trabajo || '').toLowerCase();
    body.area_trabajo = t.startsWith('an') ? 'ANALISIS' : t.startsWith('co') ? 'CONTABILIDAD' : 'PAGO';
    return this.http.patch(`${this.apiUrl}perfil/funcionarios/${rut}/`, body);
  }

  eliminarFuncionarioPerfil(rut: string) {
    const clean = rut.replace(/\./g, '').replace('-', '').toUpperCase();
    return this.http.delete(`${this.apiUrl}perfil/funcionarios/${clean}/`);
  }

>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
  ///////////////////////////// MANTENEDOR /////////////////////////////

  //SIMULACION - SIMULACION - SIMULACION - SIMULACION - SIMULACION — deberías conectar con tu backend
  buscarPorRut(rut: string): Observable<any> {
    // Reemplazar por endpoint real
    return of(null); // Simula que no se encontró
  }

  //SIMULACION - SIMULACION - SIMULACION - SIMULACION - SIMULACION — deberías conectar con tu backend
  crearFuncionario(data: any): Observable<any> {
    // Reemplazar por POST real
    return of({ success: true });
  }

  //SIMULACION - SIMULACION - SIMULACION - SIMULACION - SIMULACION — deberías conectar con tu backend
  actualizarFuncionario(funcionario: any): Observable<any> {
    console.log('Simulando actualización de:', funcionario);
    return of(true); // ← simula llamada exitosa
  }

<<<<<<< HEAD
    //SIMULACION - SIMULACION - SIMULACION - SIMULACION - SIMULACION — deberías conectar con tu backend
    eliminarFuncionario(rut: string): Observable<any> {
    console.log(`Simulando eliminación del funcionario con RUT: ${rut}`);
    return of(true).pipe(delay(1000)); // simulación de retardo
  }


=======
  //SIMULACION - SIMULACION - SIMULACION - SIMULACION - SIMULACION — deberías conectar con tu backend
  eliminarFuncionario(rut: string): Observable<any> {
    console.log(`Simulando eliminación del funcionario con RUT: ${rut}`);
    return of(true).pipe(delay(1000)); // simulación de retardo
  }
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
}
