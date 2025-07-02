import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoFuncionarioService {
  private apiUrl = 'http://localhost:8000/api/common/ingresos/';

  constructor(private http: HttpClient) {}

  crearIngreso(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

    // ✅ Método para listar los ingresos
  obtenerIngresos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  //OBTENER MOTIVOS DE PAGOS
  getMotivosPago(): Observable<any[]> {
    return this.http.get<any[]>('/api/common/motivos-pago/');
  }

  //OBTENER GRADOS
  getGrados(): Observable<any[]> {
    return this.http.get<any[]>('/api/common/grados/');
  }

  //OBTENER CONCEPTOS
  getConceptos(): Observable<any[]> {
    return this.http.get<any[]>('/api/common/conceptos/');
  }

      // ✅ Método para eliminar los ingresos
  eliminarIngreso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  actualizarIngreso(id: number, data: any): Observable<any> {
  return this.http.patch(`/api/common/ingresos/${id}/`, data);
}

}
