import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { VerifyComponent } from './component/verify/verify.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ProfileComponent } from './component/profile/profile.component';
import { HomeComponent } from './component/home/home.component';
import { CustomersComponent } from './component/customers/customers.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AuthenticationGuard } from './guard/authentication.guard';

const routes: Routes = [
	{ path: 'home', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'reset-password', component: ResetPasswordComponent },
	{ path: 'verify/account/:key', component: VerifyComponent },
	{ path: 'verify/password/:key', component: VerifyComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard] },
	{ path: 'customers', component: CustomersComponent, canActivate: [AuthenticationGuard] },
	{ path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard] },
	{ path: '', component: HomeComponent },
	{ path: '', redirectTo: '/', pathMatch: 'full'},
	{ path: '**', component: HomeComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
