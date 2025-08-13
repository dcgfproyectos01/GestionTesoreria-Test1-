import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
//import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('fadeSlideOut', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible => hidden', [
        animate('400ms ease-in-out')
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  form = { rut: '', password: '' };
  verClave: boolean = false;
  loading = true;
  showLoader = true;
  verPassword = false;
  isSubmitting: boolean = false;

  constructor(
    //private auth: AuthService,
    //private toastr: ToastrService
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.auth.login(this.form.rut, this.form.password).subscribe({
      next: (response: any) => {
        console.log(response);
        const token = response.success?.access_token;
        const expires_at = response.success?.expires_at;

        if (token &&  expires_at) {
          this.auth.saveToken(token, expires_at);
          this.auth.getUser().subscribe({
            next: user => {
              this.auth.setUser(user.success.user);

              // Verificar o crear funcionario
              // this.usuarioService.verificarCrearFuncionario(user.success.user.rut).subscribe({
                // next: (resp: any) => {
                  // console.log(resp);
                  // if (resp?.status === true) {
                    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
                    const nombre = user.success.user.primer_nombre.toLowerCase();
                    const capitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);
                    this.router.navigateByUrl(returnUrl);
                    this.toastr.success('Bienvenid@ ' + capitalizado, 'Sesión iniciada correctamente');
                  // } else {
                  //   // this.toastr.error(resp?.mensaje || 'El servidor respondió negativamente al validar funcionario');
                  //   this.auth.clearSession();
                  //   this.isSubmitting = false;
                  // }
                // },
                // error: err => {
                //   // this.toastr.error(err.error?.mensaje || 'Error desconocido al validar funcionario');
                //   this.auth.clearSession();
                //   this.isSubmitting = false;
                // }
              // });
            },
            error: () => {
              this.toastr.error('Error al cargar datos del usuario');
              this.isSubmitting = false;
            }
        });
        } else {
          this.toastr.error('Token y fecha de expiración no recibido.');
          this.isSubmitting = false;
        }
      },
      error: (error: any) => {
        this.toastr.error(error.error?.errors?.rut || 'Error al iniciar sesión');
        // alert(error.error?.errors?.rut || 'Error al iniciar sesión')
        this.isSubmitting = false;
      }
    });
    // console.log(this.form)
    // this.auth.login(this.form).subscribe({
    //   next: res => {
    //     localStorage.setItem('token', res.access);
    //     this.auth.fetchUser().subscribe(user => {
    //       this.auth.setUser(user);
    //       this.router.navigate(['/']);
    //     });
    //   },
    //   error: () => this.toastr.error('Credenciales incorrectas.', 'Error')
    // });
    
    // this.loading = true;
    // this.auth.login(this.form).subscribe({
    //   next: (response) => {
    //     console.log(response)
    //     this.auth.getUserProfile().subscribe(user => {
          //Aquí puedes guardar el usuario en un servicio compartido o store
          // console.log('Usuario autenticado:', user);
           //this.router.navigate(['/']);
    //     });
    //   },
    //   error: () => {
    //     this.loading = false;
    //     alert('Credenciales incorrectas');
    //   }
    // });
  }

  onVideoReady() {
    setTimeout(() => {
      const video = document.querySelector('video');
      if (video) {
        console.log("video")
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => this.loading = false)
            .catch(() => this.loading = false); // Igual ocultamos el loader si falla
        }
      }
    }, 500);
  }

  onLoaderAnimationDone() {
    if (!this.loading) {
      this.showLoader = false;
    }
  }

    formatearRut(valor: string): void {
    // Valida que el Rut no esté vacio
    if (!valor) {
      this.form.rut = '';
      return;
    }

    // Elimina todo excepto dígitos y k/K
    let rut = valor.replace(/[^0-9kK]/g, '').toUpperCase();

    // Separar cuerpo y DV si hay más de un dígito
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);

    // Formatear cuerpo con puntos
    let cuerpoFormateado = '';
    let rev = cuerpo.split('').reverse().join('');
    for (let i = 0; i < rev.length; i++) {
      cuerpoFormateado += rev[i];
      if ((i + 1) % 3 === 0 && i + 1 !== rev.length) {
        cuerpoFormateado += '.';
      }
    }
    cuerpoFormateado = cuerpoFormateado.split('').reverse().join('');

    // Armar RUT final
    this.form.rut = `${cuerpoFormateado}-${dv}`;
  }
}
