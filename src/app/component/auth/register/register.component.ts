import { DataState } from '../../../enum/datastate.enum';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { RegisterState } from 'src/app/interface/appstates';
import { UsuarioService } from '../../../service/usuario.service';
import { NgForm } from '@angular/forms';
import { NotificationService } from 'src/app/service/notificacion.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
	registerState$: Observable<RegisterState> = of({
		dataState: DataState.LOADED
	});
	readonly DataState = DataState;

	constructor(private UsuarioService: UsuarioService, private notificationService: NotificationService) {}

	register(registerForm: NgForm): void {
		this.registerState$ = this.UsuarioService.register$(
			registerForm.value
		).pipe(
			map((response) => {
				this.notificationService.onDefault(response.message);
				registerForm.reset();
				return { dataState: DataState.LOADED, registerSuccess: true, message: response.message };
			}),
			startWith({ dataState: DataState.LOADING, registerSuccess: false }),
			catchError((error) => {
				this.notificationService.onError(error);
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
