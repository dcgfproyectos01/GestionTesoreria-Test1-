import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [
    MatIconModule, CommonModule, RouterOutlet, MatSidenavModule,
    MatToolbarModule, MatButtonModule, RouterLink, MatMenuModule,
    RouterLinkActive, MatExpansionModule, MatTooltipModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('collapsed <=> expanded', animate('300ms ease'))
    ])
  ]
})
export class LayoutComponent implements OnInit {
  isDarkMode = false;
  sidebarOpened = true;
  isAnalisisExpanded = false;
  isContabilidadExpanded = false;
  isPagoExpanded = false;
  user: any = null;

  private routeGroups: Record<string, string[]> = {
    analisis: ['/ingreso-analisis-funcionario', '/cargar-analisis-funcionario', '/listar-analisis-funcionario'],
    contabilidad: ['/contabilidad'],
    pago: ['/pagos']
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    if (this.isDarkMode) document.documentElement.classList.add('dark');
  }

  ngOnInit() {
    // Solo nos suscribimos a los datos ya cargados en AuthService
    this.authService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;
        console.log('✅console.log: Usuario en LayoutComponent:', this.user);
      },
      error: (err) => console.error('Error al obtener usuario en Layout:', err)
    });
  }

  isGroupActive(groupName: keyof typeof this.routeGroups): boolean {
    const matchOptions = { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } as const;
    return this.routeGroups[groupName].some(route => this.router.isActive(route, matchOptions));
  }

  logout() {
    this.authService.logout();
  }

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.cdr.detectChanges();
  }

  isActive(url: string): boolean {
    return this.router.isActive(url, { paths: 'exact', matrixParams: 'ignored', queryParams: 'ignored', fragment: 'ignored' });
  }
}
