import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthenticationGuard } from 'src/app/guard/authentication.guard';
import { ProductoComponent } from './producto/producto.component';

const dashboardRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard] },
	{ path: 'dashboard/producto/new', component: ProductoComponent, canActivate: [AuthenticationGuard] },
];

@NgModule({
	imports: [RouterModule.forChild(dashboardRoutes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
