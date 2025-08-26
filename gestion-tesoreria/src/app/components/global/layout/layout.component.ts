import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
<<<<<<< HEAD
=======
import { IngresoFuncionarioService } from '../../../services/ingreso-funcionario.service'; // NEW

>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)

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
      state('collapsed', style({
        height: '0px',
        visibility: 'hidden' // Solo las animables
      })),
      state('expanded', style({
        height: '*',
        visibility: 'visible'
      })),
      transition('collapsed <=> expanded', animate('300ms ease'))
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidenavScrollRef') sidenavScrollRef!: ElementRef;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isDarkMode = false;
  sidebarOpened = true;
  isAnalisisExpanded = false;
  isContabilidadExpanded = false;
  isPagoExpanded = false;
  scrollTopAnterior: number = 0;
  user: any = null;
  currentUser: any = {};
  sidenavMode: 'over' | 'side' = 'side';
  expiracionClave: string = '';
  private expiracionIntervalId: any = null;
  private routeGroups: Record<string, string[]> = {
    analisis: ['/ingreso-analisis-funcionario', '/cargar-analisis-funcionario', '/listar-analisis-funcionario'],
    contabilidad: ['/contabilidad'],
    pago: ['/pagos']
  };
<<<<<<< HEAD
=======
  PagoHaberes = false;  // NEW
  Desahucio = false;    // NEW
  appsLoading = true;              // <- NUEVO
  get AnyApp() {                  // <- NUEVO
    return this.PagoHaberes || this.Desahucio;
  }
  private readonly APP = { PAGO_HABERES: 1, DESAHUCIO: 2 }; // NEW
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private toastr: ToastrService,
    private breakpointObserver: BreakpointObserver,
<<<<<<< HEAD
=======
    private api: IngresoFuncionarioService, // NEW
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
  ) {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    if (this.isDarkMode) document.documentElement.classList.add('dark');
  }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.sidenavMode = 'over';
        setTimeout(() => this.sidenav.close(), 0);
      } else {
        this.sidenavMode = 'side';
        setTimeout(() => this.sidenav.open(), 0);
      }
    });

    this.currentUser = this.auth.getCurrentUser();
<<<<<<< HEAD
    // console.log('Usuario actual:', this.currentUser);
=======
    console.log('Current user:', this.currentUser);
    console.log('Usuario actual:', this.currentUser.primer_nombre);


>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)

    //Al completar tiempo de expiracion
    const changedAtStr = this.currentUser.password_changed_at;
    if (changedAtStr) {
      // Llamada inicial
      this.actualizarExpiracionClave(changedAtStr);

      // Intervalo que actualiza cada 1 minuto
      this.expiracionIntervalId = setInterval(() => {
        this.actualizarExpiracionClave(changedAtStr);
      }, 60 * 1000);
    } else {
      console.warn('No se encontró la fecha de cambio de contraseña');
    }
<<<<<<< HEAD
=======

    const rut = this.auth.getCurrentUser()?.rut;
    if (rut) {
      this.cargarAppsDeUsuario(rut);
    }


  }

  private cargarAppsDeUsuario(rut: string) {
    this.appsLoading = true;
    this.api.getAppsDeRut(rut).subscribe({
      next: (res: any) => {
        const ids: number[] = res?.apps || [];
        this.PagoHaberes = ids.includes(this.APP.PAGO_HABERES);
        this.Desahucio  = ids.includes(this.APP.DESAHUCIO);
        this.appsLoading = false;              // <- NUEVO
        this.cdr.markForCheck();
      },
      error: () => {
        this.PagoHaberes = false;
        this.Desahucio = false;
        this.appsLoading = false;             // <- NUEVO
      }
    });
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
  }

  ngAfterViewInit(): void {
    this.sidenav.openedChange.subscribe(opened => {
      if (opened && this.sidenavMode === 'over') {
        setTimeout(() => {
          if (this.sidenavScrollRef?.nativeElement) {
            this.sidenavScrollRef.nativeElement.scrollTop = this.scrollTopAnterior;
          }
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.expiracionIntervalId) {
      clearInterval(this.expiracionIntervalId);
    }
  }

<<<<<<< HEAD
=======

  
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
  actualizarExpiracionClave(changedAtStr: string) {
    const changedAt = new Date(changedAtStr.replace(' ', 'T'));
    const expirationDate = new Date(changedAt.getTime() + 60 * 24 * 60 * 60 * 1000);
    const now = new Date();

    const diffMs = expirationDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      this.expiracionClave = 'Expirada';
      clearInterval(this.expiracionIntervalId); // detener contador
      return;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    this.expiracionClave = `${days}d ${hours}h ${minutes}m`;
  }

  isGroupActive(groupName: keyof typeof this.routeGroups): boolean {
    const matchOptions = { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } as const;
    return this.routeGroups[groupName].some(route => this.router.isActive(route, matchOptions));
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.auth.clearSession();
        setTimeout(() => this.router.navigate(['/login']), 0);
        // alert('Sesión cerrada correctamente')
        this.toastr.info('Sesión cerrada correctamente');
      },
      error: () => {
        this.auth.clearSession();
        setTimeout(() => this.router.navigate(['/login']), 0);
        this.toastr.warning('Sesión cerrada correctamentes');
        // alert('Sesión cerrada correctamente')
      }
    });
  }

  toggleSidebar() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  toggleDarkMode() {
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

  closeSidebarIsMobile(): void {
    if (this.sidenavMode === 'over') {
      this.scrollTopAnterior = this.sidenavScrollRef?.nativeElement?.scrollTop || 0;
      setTimeout(() => this.sidenav.close(), 0);
    }
  }

  isActive(url: string): boolean {
    return this.router.isActive(url, { paths: 'exact', matrixParams: 'ignored', queryParams: 'ignored', fragment: 'ignored' });
  }
}
