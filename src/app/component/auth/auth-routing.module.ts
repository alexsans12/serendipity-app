import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyComponent } from './verify/verify.component';

const authRoutes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'reset-password', component: ResetPasswordComponent },
	{ path: 'user/verify/account/:key', component: VerifyComponent },
	{ path: 'user/verify/password/:key', component: VerifyComponent },
];

@NgModule({
	imports: [RouterModule.forChild(authRoutes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
