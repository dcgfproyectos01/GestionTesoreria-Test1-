<<<<<<< HEAD

///////
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
=======
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { IngresoFuncionarioService } from '../../../services/ingreso-funcionario.service';
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentUser: any = null;

<<<<<<< HEAD
  constructor(
    private auth: AuthService,
  ) {}

  ngOnInit() {
    // Suscripción al BehaviorSubject sin forzar nueva petición HTTP
    this.currentUser = this.auth.getCurrentUser();
    console.log(this.currentUser)
  }
} 
=======
  seccionApps = '';
  cargandoSeccion = false;
  errorSeccion = '';

  private catalogoApps: Record<number, string> = {}; // id -> nombre

  constructor(
    private auth: AuthService,
    private api: IngresoFuncionarioService
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    if (this.currentUser?.rut) {
      this.cargarSeccion(this.currentUser.rut);
    }
  }

  private cargarSeccion(rut: string) {
    this.cargandoSeccion = true;
    this.errorSeccion = '';
    this.seccionApps = '';

    // 1) Cargar catálogo (id->nombre)
    this.api.listarApps().subscribe({
      next: (apps: any[]) => {
        this.catalogoApps = {};
        (apps || []).forEach(a => {
          // backend: {id_aplicacion, nombre}
          this.catalogoApps[a.id_aplicacion] = a.nombre;
        });

        // 2) Cargar asignaciones del usuario (lista de IDs)
        this.api.getAppsDeRut(rut).subscribe({
          next: (res: any) => {
            const ids: number[] = res?.apps || [];
            const nombres = ids
              .map(id => this.catalogoApps[id])
              .filter(Boolean);

            this.seccionApps = nombres.length ? nombres.join(', ') : 'Sin asignación';
            this.cargandoSeccion = false;
          },
          error: err => {
            console.error(err);
            this.errorSeccion = 'Usuario no asignado a sub-sistema';
            this.cargandoSeccion = false;
          }
        });
      },
      error: err => {
        console.error(err);
        this.errorSeccion = 'No fue posible cargar el catálogo de aplicaciones';
        this.cargandoSeccion = false;
      }
    });
  }
}
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
