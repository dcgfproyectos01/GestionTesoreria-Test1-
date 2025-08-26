import { Routes } from '@angular/router';
import { PerfilamientoComponent } from './pages/valores-retenidos/perfilamiento/perfilamiento.component';
import { HomeComponent } from './pages/global/home/home.component';
import { IngresoAnalisisFuncionarioComponent } from './pages/valores-retenidos/ingreso-analisis-funcionario/ingreso-analisis-funcionario.component';
import { CargarAnalisisFuncionarioComponent } from './pages/valores-retenidos/cargar-analisis-funcionario/cargar-analisis-funcionario.component';
import { ListarAnalisisFuncionarioComponent } from './pages/valores-retenidos/listar-analisis-funcionario/listar-analisis-funcionario.component';
import { ContabilidadComponent } from './pages/valores-retenidos/contabilidad/contabilidad.component';
import { PagosComponent } from './pages/valores-retenidos/pagos/pagos.component';
import { ReportabilidadComponent } from './pages/valores-retenidos/reportabilidad/reportabilidad.component';
import { LoginComponent } from './pages/global/login/login.component';
import { LayoutComponent } from './components/global/layout/layout.component';
<<<<<<< HEAD
=======
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { BibliotecaComponent } from './pages/global/biblioteca/biblioteca.component';
import { ConfiguracionComponent } from './pages/global/configuracion/configuracion.component';
import { MiPerfilComponent } from './pages/global/mi-perfil/mi-perfil.component';
import { MantenedorComponent } from './pages/global/mantenedor/mantenedor.component';
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)



export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
<<<<<<< HEAD
        children: [
            { path: '', component: HomeComponent }, //HOME
            { path: 'ingreso-analisis-funcionario', component: IngresoAnalisisFuncionarioComponent},
            { path: 'cargar-analisis-funcionario', component: CargarAnalisisFuncionarioComponent},
            { path: 'listar-analisis-funcionario', component: ListarAnalisisFuncionarioComponent},
            { path: 'contabilidad', component: ContabilidadComponent},
            { path: 'pagos', component: PagosComponent},
            { path: 'perfilamiento', component: PerfilamientoComponent},
            { path: 'reportabilidad', component: ReportabilidadComponent}
        ]
    },

    { path: 'login', component: LoginComponent }
=======
        canActivate: [authGuard],
        children: [
            { path: '', component: HomeComponent }, //HOME
            { path: 'mi-perfil',                    component: MiPerfilComponent},
            { path: 'ingreso-analisis-funcionario', component: IngresoAnalisisFuncionarioComponent},
            { path: 'cargar-analisis-funcionario',  component: CargarAnalisisFuncionarioComponent},
            { path: 'listar-analisis-funcionario',  component: ListarAnalisisFuncionarioComponent},
            { path: 'contabilidad',                 component: ContabilidadComponent},
            { path: 'pagos',                        component: PagosComponent},
            { path: 'perfilamiento',                component: PerfilamientoComponent},
            { path: 'reportabilidad',               component: ReportabilidadComponent},
            { path: 'mantenedor',                   component: MantenedorComponent},
            { path: 'biblioteca',                   component: BibliotecaComponent},
            { path: 'configuracion',                component: ConfiguracionComponent}
        ]
    },

    { path: 'login', component: LoginComponent, canActivate: [guestGuard] }
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
];
