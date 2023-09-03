import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home/home.component';

const routes: Routes = [
	{ path: 'profile', loadChildren: () => import('./component/profile/usuario.module').then(module => module.UsuarioModule) },
	{ path: '', redirectTo: '/', pathMatch: 'full'},
	{ path: '**', component: HomeComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
