import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoFuncionarioService {
  private apiUrl = 'http://des.gestiontesoreria.carabineros.cl/api/common/';
  // private apiUrl = 'http://localhost:8000/api/common/ingresos/';


  constructor(private http: HttpClient) {}

  crearIngreso(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}ingresos/`, data);
  }

  // ✅ Método para listar los ingresos
  obtenerIngresos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}ingresos/`);

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

  // ✅ Método para eliminar los ingresos
  eliminarIngreso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  actualizarIngreso(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}${id}/`, data);
  }



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

    //SIMULACION - SIMULACION - SIMULACION - SIMULACION - SIMULACION — deberías conectar con tu backend
    eliminarFuncionario(rut: string): Observable<any> {
    console.log(`Simulando eliminación del funcionario con RUT: ${rut}`);
    return of(true).pipe(delay(1000)); // simulación de retardo
  }


}
