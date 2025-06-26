import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
//import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
    private router: Router,
    //private toastr: ToastrService
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
    this.router.navigate(['/']);
  }

  onVideoReady() {
    setTimeout(() => {
      const video = document.querySelector('video');
      if (video) {
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
