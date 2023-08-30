import { DataState } from './../../enum/datastate.enum';
import { Component } from '@angular/core';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { RegisterState } from 'src/app/interface/appstates';
import { UsuarioService } from '../../service/usuario.service';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
	registerState$: Observable<RegisterState> = of({
		dataState: DataState.LOADED
	});
	readonly DataState = DataState;

	constructor(private UsuarioService: UsuarioService) {}

	register(registerForm: NgForm): void {
		this.registerState$ = this.UsuarioService.register$(
			registerForm.value
		).pipe(
			map((response) => {
				console.log(response);
				registerForm.reset();
				return { dataState: DataState.LOADED, registerSuccess: true, message: response.message };
			}),
			startWith({ dataState: DataState.LOADING, registerSuccess: false }),
			catchError((error) => {
				return of({
					dataState: DataState.ERROR,
					registerSuccess: false,
					error,
				});
			})
		);
	}

	createAccountForm(): void {
		this.registerState$ = of({ dataState: DataState.LOADED, registerSuccess: false });
	}
}
