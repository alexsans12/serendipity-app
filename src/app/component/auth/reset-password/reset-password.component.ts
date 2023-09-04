import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { RegisterState } from 'src/app/interface/appstates';
import { UsuarioService } from 'src/app/service/usuario.service';
import { NotificationService } from 'src/app/service/notificacion.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
	resetPasswordState$: Observable<RegisterState> = of({
		dataState: DataState.LOADED
	});
	readonly DataState = DataState;

	constructor(private usuarioService: UsuarioService, private notificationService: NotificationService) {}

	resetPassword(resetPasswordForm: NgForm): void {
		this.resetPasswordState$ = this.usuarioService.requestPasswordReset$(
			resetPasswordForm.value.email
		).pipe(
			map((response) => {
				this.notificationService.onDefault(response.message);
				resetPasswordForm.reset();
				return {
					dataState: DataState.LOADED,
					registerSuccess: true,
					message: response.message,
				};
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
}
