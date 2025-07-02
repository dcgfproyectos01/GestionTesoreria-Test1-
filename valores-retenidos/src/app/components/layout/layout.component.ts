import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-layout',
  imports: [MatIconModule, CommonModule, RouterOutlet, MatSidenavModule, MatToolbarModule, MatButtonModule, RouterLink, MatMenuModule, RouterLinkActive, MatExpansionModule, MatTooltipModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0px',
        visibility: 'hidden' // solo las animables
      })),
      state('expanded', style({
        height: '*',
        visibility: 'visible'
      })),
      transition('collapsed <=> expanded', animate('300ms ease'))
    ])
  ]
})


export class LayoutComponent {
  //Ejectuado dentro del html, variables banderas
  isDarkMode = false;
  sidebarOpened = true;
  isAnalisisExpanded = false;
  isContabilidadExpanded = false;
  isPagoExpanded = false;

  private routeGroups: Record<string, string[]> = {
    //ruta para ingreso funcionario, separarado por área
    analisis: ['/ingreso-analisis-funcionario','/cargar-analisis-funcionario','/listar-analisis-funcionario'],
    contabilidad: ['/contabilidad'],
    pago: ['/pagos']
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ){
    // Comprobar si ya estaba activado el modo oscuro en localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
    }
  }

  isGroupActive(groupName: keyof typeof this.routeGroups): boolean {
    const matchOptions = {
      paths: 'subset',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored'
    } as const;

    return this.routeGroups[groupName].some(route => this.router.isActive(route, matchOptions));
  }

  logout(){
    this.router.navigate(['/login']);
  }

  toggleSidebar(){
    this.sidebarOpened = !this.sidebarOpened;
  }
  
  toggleDarkMode(){
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    this.cdr.detectChanges();
  }

  isActive(url: string): boolean {
    return this.router.isActive(url, { paths: 'exact', matrixParams: 'ignored', queryParams: 'ignored', fragment: 'ignored' });
  }
}
