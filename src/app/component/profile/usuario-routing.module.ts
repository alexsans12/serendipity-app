import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioComponent } from './usuario/usuario.component';
import { AuthenticationGuard } from 'src/app/guard/authentication.guard';

const usuarioRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: UsuarioComponent,
				canActivate: [AuthenticationGuard],
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(usuarioRoutes)],
	exports: [RouterModule],
})
export class UsuarioRoutingModule {}
