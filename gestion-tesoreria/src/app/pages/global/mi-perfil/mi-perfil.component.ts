import { Component } from '@angular/core';
<<<<<<< HEAD

@Component({
  selector: 'app-mi-perfil',
  imports: [],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {

=======
import { CommonModule } from '@angular/common';
import { IngresoFuncionarioService } from '../../../services/ingreso-funcionario.service';
import { AuthService } from '../../../services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { trigger, state, style, transition, animate } from '@angular/animations';
//import { SpinnerComponent } from '../../../components/spinner/spinner.component';

@Component({
  selector: 'app-mi-perfil',
  imports: [CommonModule, MatIcon], //SpinnerComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class MiPerfilComponent {
  currentUser: any = {};
  urlFotoFuncionario: any = null;
  loaderFuncionario: boolean = true;
  ultimaSesion: string = '';
  listaCodEscalafonUniformado: string[] = [
    "214120", "110100", "214261", "214100", "120700", "214400", "214101",
    "214206", "214216", "230400", "214260", "120900", "120800", "214900",
    "131500", "214204", "214202", "214203", "131400", "214103", "121100",
    "214275", "214272", "121000", "230100", "214108", "214110", "214207",
    "131600", "110300", "214201", "214300", "214270", "214271", "214500",
    "214600", "132701", "214208", "700000", "310300", "214105", "231004",
    "214209", "230200", "230300", "800000", "214280", "132702", "700000",
    "132500", "700000", "132400", "214246", "214227", "121200", "700000",
    "214278", "700000", "800000", "700000", "700000", "231002", "132705",
    "720000", "214001", "310300", "310300", "132000", "310300",
  ];

  constructor(
    public usuarioService: IngresoFuncionarioService
  ){}

  ngOnInit(): void {
    this.loaderFuncionario = true;
    this.ultimaSesion = localStorage.getItem('auth_expires_at') ?? '';

    const fecha = new Date(this.ultimaSesion.replace(' ', 'T'));
    fecha.setDate(fecha.getDate() - 1);

    const [yyyy, mm, dd] = fecha.toISOString().slice(0, 10).split('-');
    const hora = fecha.toTimeString().slice(0, 5); // "HH:MM"

    this.ultimaSesion = `${dd}/${mm}/${yyyy} - ${hora}`;

    // Obiene los datos del funcionario autenticado
    // this.usuarioService.obtenerFuncionarioAutenticado().subscribe({
    //   next: (user) => {
    //     this.currentUser = user;
    //     console.log('Usuario con perfil completo:', this.currentUser);
    //   },
    //   error: (err) => {
    //     console.error('Error al cargar perfil completo:', err);
    //   },
    //   complete: () => {
    //     this.loaderFuncionario = false;
    //   }
    // });
  }

  getImagenPerfil(): string {
    const genero = this.currentUser.genero; // 'M' o 'F'
    const codEscalafon = this.currentUser.codigo_escalafon || '';

    // Verifica si el escalafón está dentro de los uniformados
    const esUniformado = this.listaCodEscalafonUniformado.includes(codEscalafon);
    if (esUniformado) {
      if(genero === 'M') {
        return 'assets/img/perfil_carabinero_varon.png';
      } else {
        return 'assets/img/perfil_carabinero_mujer.png';
      }
    } else {
      if(genero === 'M') {
        return 'assets/img/perfil_civil_varon.png';
      } else {
        return 'assets/img/perfil_civil_mujer.png';
      }
    }
  }
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
}
