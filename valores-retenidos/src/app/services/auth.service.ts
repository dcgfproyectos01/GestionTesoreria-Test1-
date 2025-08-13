import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  fetchUser() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://des.gestiontesoreria.carabineros.cl/api/common';
  private userDataSubject = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // --- LOGIN ---
  login(credentials: { username: string; password: string }) {
    return this.http.post(`${this.apiUrl}/token/`, credentials).pipe(
      tap((tokens: any) => {
        // Guardamos el token
        localStorage.setItem('access_token', tokens.access);

        // Cargar el perfil una sola vez
        this.loadUserProfile().subscribe({
          error: (err) => {
            console.error('Error cargando perfil después de login:', err);
            this.logout();
          }
        });
      })
    );
  }

  // --- INIT (ejecutado al refrescar) ---
  async init(): Promise<void> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return Promise.resolve();
    }

    // Cargar el perfil solo si aún no está disponible en userDataSubject
    if (!this.userDataSubject.value) {
      try {
        await firstValueFrom(this.loadUserProfile());
      } catch (error) {
        console.warn('Token inválido o expirado. Redirigiendo al login.');
        this.logout();
        this.router.navigate(['/login']);
      }
    }
  }

  // --- Cargar perfil ---
  loadUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me/`).pipe(
      tap(data => {
        this.userDataSubject.next(data);
        console.log('auth.service: Perfil de usuario cargado:', data);
      })
    );
  }

  // --- Obtener perfil (solo lectura) ---
  getUserProfile(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  // --- Logout ---
  logout() {
    localStorage.removeItem('access_token');
    this.userDataSubject.next(null);
    this.router.navigate(['/login']);
  }
}
