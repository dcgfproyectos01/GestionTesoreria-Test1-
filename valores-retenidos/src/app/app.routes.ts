import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { IngresoAnalisisFuncionarioComponent } from './pages/ingreso-analisis-funcionario/ingreso-analisis-funcionario.component';
import { PagosComponent } from './pages/pagos/pagos.component';
import { ContabilidadComponent } from './pages/contabilidad/contabilidad.component';
import { ReportabilidadComponent } from './pages/reportabilidad/reportabilidad.component';
import { ListarAnalisisFuncionarioComponent } from './pages/listar-analisis-funcionario/listar-analisis-funcionario.component';
import { CargarAnalisisFuncionarioComponent } from './pages/cargar-analisis-funcionario/cargar-analisis-funcionario.component';


export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'ingreso-analisis-funcionario', component: IngresoAnalisisFuncionarioComponent},
            { path: 'cargar-analisis-funcionario', component: CargarAnalisisFuncionarioComponent},
            { path: 'listar-analisis-funcionario', component: ListarAnalisisFuncionarioComponent},
            { path: 'contabilidad', component: ContabilidadComponent},
            { path: 'pagos', component: PagosComponent},
            { path: 'reportabilidad', component: ReportabilidadComponent}
        ]
    },

    { path: 'login', component: LoginComponent }
];
