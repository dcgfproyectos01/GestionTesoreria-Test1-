
///////
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private auth: AuthService,
  ) {}

  ngOnInit() {
    // Suscripción al BehaviorSubject sin forzar nueva petición HTTP
    this.currentUser = this.auth.getCurrentUser();
    console.log(this.currentUser)
  }
} 
