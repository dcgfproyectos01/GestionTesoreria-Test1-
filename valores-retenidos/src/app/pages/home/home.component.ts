import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  user: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Suscripción al BehaviorSubject sin forzar nueva petición HTTP
    this.authService.getUserProfile().subscribe((data) => {
      this.user = data;
      if (this.user) {
        console.log('✅console.log: Usuario cargado en HomeComponent:', this.user);
      } else {
        console.warn('⚠️console.log: Usuario aún no disponible en HomeComponent.');
      }
    });
  }
}
