import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
//import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';

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
  form = { username: '', password: '' };
  verClave: boolean = false;
  loading = true;
  showLoader = true;
  verPassword = false;

  constructor(
    //private auth: AuthService,
    //private toastr: ToastrService
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit() {
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
           this.router.navigate(['/']);
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
}
