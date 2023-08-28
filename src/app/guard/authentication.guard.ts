import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationGuard {

	constructor(private usuarioService: UsuarioService, private router: Router) {}

	canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.isAuthenticated();
	}

	private isAuthenticated(): boolean {
		if(this.usuarioService.isAuthenticated()) {
			return true;
		} else {
			this.router.navigate(['/login']);
			return false;
		}
	}
}
