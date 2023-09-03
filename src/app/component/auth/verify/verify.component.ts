import { Component, OnInit } from '@angular/core';
import {
	BehaviorSubject,
	Observable,
	map,
	switchMap,
	startWith,
	catchError,
	of,
} from 'rxjs';
import { AccountType, VerifyState } from 'src/app/interface/appstates';
import { Usuario } from 'src/app/interface/usuario';
import { DataState } from '../../../enum/datastate.enum';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UsuarioService } from 'src/app/service/usuario.service';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-verify',
	templateUrl: './verify.component.html',
	styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
	verifyState$: Observable<VerifyState>;
	private usuarioSubject = new BehaviorSubject<Usuario>(null);
	usuario$ = this.usuarioSubject.asObservable();
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	readonly DataState = DataState;
	private readonly ACCOUNT_TYPE: string = 'key';

	constructor(
		private activatedRouter: ActivatedRoute,
		private usuarioService: UsuarioService
	) {}

	ngOnInit(): void {
		this.verifyState$ = this.activatedRouter.paramMap.pipe(
			switchMap((params: ParamMap) => {
				console.log(this.activatedRouter);
				const type: AccountType = this.getAccountType(
					window.location.href
				);
				return this.usuarioService
					.verify$(params.get(this.ACCOUNT_TYPE), type)
					.pipe(
						map((response) => {
							console.log(response);
							type === 'password'
								? this.usuarioSubject.next(
										response.data.usuario
								  )
								: null;
							return {
								type,
								title: 'verificación de cuenta',
								dataState: DataState.LOADED,
								message: response.message,
								verifySuccess: true,
							};
						}),
						startWith({
							title: 'Verificando...',
							dataState: DataState.LOADING,
							message:
								'Por favor espere mientras verificamos su información.',
							verifySuccess: false,
						}),
						catchError((error) => {
							this.usuarioSubject.next(error);
							return of({
								title: 'Ah ocurrido un error',
								dataState: DataState.ERROR,
								error,
								message: error,
								verifySuccess: false,
							});
						})
					);
			})
		);
	}

	renewPassword(resetPasswordForm: NgForm): void {
		this.isLoadingSubject.next(true);
		this.verifyState$ = this.usuarioService
			.renewPassword$({
				idUsuario: this.usuarioSubject.value.idUsuario,
				password: resetPasswordForm.value.password,
				confirmPassword: resetPasswordForm.value.confirmPassword,
			})
			.pipe(
				map((response) => {
					this.isLoadingSubject.next(false);
					return {
						type: 'account' as AccountType,
						title: 'Su contraseña ha sido actualizada',
						dataState: DataState.LOADED,
						message: response.message,
						verifySuccess: true,
					};
				}),
				startWith({
					type: 'password' as AccountType,
					title: 'Verificado!',
					dataState: DataState.LOADED,
					verifySuccess: false,
				}),
				catchError((error) => {
					this.isLoadingSubject.next(false);
					return of({
						type: 'password' as AccountType,
						title: 'Verificado!',
						error,
						dataState: DataState.LOADED,
						verifySuccess: true,
					});
				})
			);
	}

	private getAccountType(url: string): AccountType {
		return url.includes('account') ? 'account' : 'password';
	}
}
