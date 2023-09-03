import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyComponent } from './verify/verify.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { FooterModule } from '../footer/footer.module';

@NgModule({
	declarations: [
		LoginComponent,
		RegisterComponent,
		ResetPasswordComponent,
		VerifyComponent,
	],
	imports: [
		SharedModule,
		AuthRoutingModule,
		NavbarModule,
		FooterModule
	]
})
export class AuthModule {}
