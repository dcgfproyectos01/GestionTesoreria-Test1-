import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ 
  providedIn: 'root'
 })

export class AuthService {
  private apiUrl = 'http://autentificaticapi.carabineros.cl/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {}

  init(): Promise<void> {
    return new Promise((resolve) => {
      const token = this.getToken();
      const expiresAtStr = this.getExpiresAt();

      if (!token || !expiresAtStr) {
        this.clearSession();
        resolve();
        return;
      }

      this.validateToken().subscribe({
        next: () => {
          this.getUser().subscribe({
            next: userData => {
              const user = userData.success.user;
              this.setUser(user);
              this.programarExpiracionToken(expiresAtStr);
              resolve();
            },
            error: () => {
              this.clearSession();
              resolve();
            }
          });
        },
        error: () => {
          this.clearSession();
          resolve();
        }
      });
    });
  }


  login(rut: string, password: string): Observable<any> {
    const rutNormalizado = this.normalizarRut(rut);

    const body = new HttpParams()
      .set('rut', rutNormalizado)
      .set('password', password);

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${this.apiUrl}/login`, body.toString(), { headers });
  }


  logout() {
    const headers = this.getAuthHeaders();
    if (!headers) return of({}); // no hay token, no se hace nada

    return this.http.get(`${this.apiUrl}/logout`, { headers });
  }

  getUser(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    return new Observable(observer => {
      this.http.get<any>(`${this.apiUrl}/user-full`, { headers }).subscribe({
        next: (userData) => {
          const user = userData.success.user;
          observer.next({ success: { user } });
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }


  validateToken(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null);

    return this.http.get(`${this.apiUrl}/validate-token`, { headers });
  }

  limpiarRut(rut: string): string {
    return rut.replace(/[^0-9Kk]/g, '').toUpperCase();
  }

  private getAuthHeaders(): HttpHeaders | null {
    const token = this.getToken();
    if (!token) return null;

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  private normalizarRut(rut: string): string {
    let r = rut.replace(/\./g, '').replace('-', '');
    return r.length === 8 ? r.padStart(9, '0') : r;
  }

  private programarExpiracionToken(expiresAtStr: string) {
    const now = new Date().getTime();
    const exp = new Date(expiresAtStr).getTime();
    const tiempoRestante = exp - now;

    if (tiempoRestante > 0) {
      setTimeout(() => {
        this.clearSession();
        window.location.href = '/login';
      }, tiempoRestante);
    }
  }

  setUser(user: any) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  saveToken(token: string, expiresAt: string) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_expires_at', expiresAt);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getExpiresAt(): string | null {
    return localStorage.getItem('auth_expires_at');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearSession() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_expires_at');
  }
}
