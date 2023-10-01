import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../service/usuario.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import {
	BehaviorSubject,
	Observable,
	catchError,
	map,
	of,
	startWith,
} from 'rxjs';
import { LoginState } from '../../../interface/appstates';
import { DataState } from 'src/app/enum/datastate.enum';
import { key } from 'src/app/enum/key.enum';
import { NotificationService } from 'src/app/service/notificacion.service';
import { CarritoService } from 'src/app/service/carrito.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
	loginState$: Observable<LoginState> = of({ dataState: DataState.LOADED });
	private phoneSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
		null
	);
	private emailSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
		null
	);
	readonly DataState = DataState;

	constructor(
		private router: Router,
		private usuarioService: UsuarioService,
		private carritoService: CarritoService,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.usuarioService.isAuthenticated()
			? this.router.navigate(['/'])
			: this.loginPage();
	}

	login(loginForm: NgForm): void {
		this.loginState$ = this.usuarioService
			.login$(loginForm.value.email, loginForm.value.password)
			.pipe(
				map((response) => {
					if (response.data.usuario.utilizaMfa) {
						this.notificationService.onDefault(response.message);
						this.phoneSubject.next(response.data.usuario.telefono);
						this.emailSubject.next(response.data.usuario.email);
						return {
							dataState: DataState.LOADED,
							isUsingMfa: true,
							loginSuccess: false,
							phone: response.data.usuario.telefono.substring(
								response.data.usuario.telefono.length - 4
							),
						};
					} else {
						this.notificationService.onDefault(response.message);
						localStorage.setItem(
							key.TOKEN,
							response.data.access_token
						);
						localStorage.setItem(
							key.REFRESH_TOKEN,
							response.data.refresh_token
						);

						// Paso 1: Obtener el carrito de localStorage
						const carritoLocalStorage =
							localStorage.getItem('carrito');

						if (carritoLocalStorage) {
							const carrito = JSON.parse(carritoLocalStorage);

							// Formatear el carrito para que solo contenga idProducto y cantidad para cada producto
							const carritoFormateado =
								carrito.carrito.carritoProductos.map((p) => ({
									idProducto: p.idProducto,
									cantidad: p.cantidad,
								}));

							// Paso 2: Enviar el carrito al servidor
							this.carritoService
								.createCart$(carritoFormateado)
								.subscribe({
									next: (res) => {
										// Paso 3: Limpiar el localStorage
										localStorage.removeItem('carrito');
										this.router.navigate(['/']);
									},
									error: (err) => {
										// Manejar el error aquí
										this.notificationService.onError(
											'Error al crear el carrito'
										);
									},
								});
						} else {
							this.router.navigate(['/']);
						}
						return {
							dataState: DataState.LOADED,
							loginSuccess: true,
						};
					}
				}),
				startWith({ dataState: DataState.LOADING, isUsingMfa: false }),
				catchError((error: string) => {
					this.notificationService.onError(error);
					return of({
						dataState: DataState.ERROR,
						isUsingMfa: false,
						loginSuccess: false,
						error,
					});
				})
			);
	}

	verifyCode(verifyCodeForm: NgForm): void {
		if (
			verifyCodeForm.invalid ||
			!this.emailSubject.value ||
			!this.phoneSubject.value
		) {
			return;
		}
		this.loginState$ = this.usuarioService
			.verifyCode$(this.emailSubject.value, verifyCodeForm.value.code)
			.pipe(
				map((response) => {
					localStorage.setItem(key.TOKEN, response.data.access_token);
					localStorage.setItem(
						key.REFRESH_TOKEN,
						response.data.refresh_token
					);
					this.router.navigate(['/']);
					return { dataState: DataState.LOADED, loginSuccess: true };
				}),
				startWith({
					dataState: DataState.LOADING,
					isUsingMfa: true,
					loginSuccess: false,
					phone: this.phoneSubject.value.substring(
						this.phoneSubject.value.length - 4
					),
				}),
				catchError((error: string) => {
					return of({
						dataState: DataState.ERROR,
						isUsingMfa: true,
						loginSuccess: false,
						error,
						phone: this.phoneSubject.value?.substring(
							this.phoneSubject.value.length - 4
						),
					});
				})
			);
	}

	loginPage(): void {
		this.loginState$ = of({ dataState: DataState.LOADED });
	}
}
