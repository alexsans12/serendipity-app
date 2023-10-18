import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthenticationGuard } from 'src/app/guard/authentication.guard';

const dashboardRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard] },
];

@NgModule({
	imports: [RouterModule.forChild(dashboardRoutes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
