import { Component, OnInit } from '@angular/core';
import {
	BehaviorSubject,
	Observable,
	catchError,
	map,
	of,
	startWith,
} from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import {
	Cart,
	CustomHttpResponse,
	Page,
	Profile,
} from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { Usuario } from 'src/app/interface/usuario';
import { UsuarioService } from 'src/app/service/usuario.service';
import { CarritoService } from '../../../service/carrito.service';
import { NotificationService } from 'src/app/service/notificacion.service';
import { Producto } from 'src/app/interface/producto';

@Component({
	selector: 'app-shopping-cart',
	templateUrl: './shopping-cart.component.html',
	styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
	cartState$: Observable<State<CustomHttpResponse<Cart>>>;
	usuarioState$: Observable<State<CustomHttpResponse<Profile>>>;
	private dataSubject = new BehaviorSubject<CustomHttpResponse<Page>>(null);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>(false);
	showLogs$ = this.showLogsSubject.asObservable();
	readonly DataState = DataState;

	constructor(
		private usuarioService: UsuarioService,
		private carritoService: CarritoService,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		if (this.usuarioService.isAuthenticated()) {
			this.usuarioState$ = this.usuarioService.profile$().pipe(
				map((response) => {
					this.dataSubject.next({
						...response,
						data: {
							...response.data,
							usuario: {
								...response.data.usuario,
								urlFoto: `${
									response.data.usuario.urlFoto
								}?time=${new Date().getTime()}`,
							},
						},
					});
					return { dataState: DataState.LOADED, appData: response };
				}),
				startWith({ dataState: DataState.LOADING }),
				catchError((error: string) => {
					return of({
						dataState: DataState.ERROR,
						appData: this.dataSubject.value,
						error,
					});
				})
			);
		}

		this.cartState$ = this.carritoService.cart$().pipe(
			map((response) => {
				if (!response.message) {
					let carrito = JSON.parse(localStorage.getItem('carrito'));
					this.dataSubject.next({
						...response,
						data: carrito,
					});
					return {
						dataState: DataState.LOADED,
						appData: { ...response, data: carrito },
					};
				}
				this.dataSubject.next(response);
				return { dataState: DataState.LOADED, appData: response };
			}),
			startWith({ dataState: DataState.LOADING }),
			catchError((error: string) => {
				return of({
					dataState: DataState.ERROR,
					appData: this.dataSubject.value,
					error,
				});
			})
		);
	}

	addToCart(producto: Producto) {
		this.cartState$ = this.carritoService.addToCart$(producto).pipe(
			map((response) => {
				if (!response.message) {
					let carrito = JSON.parse(localStorage.getItem('carrito'));
					this.notificationService.onDefault(
						'Producto agregado al carrito'
					);
					this.dataSubject.next({
						...response,
						data: carrito,
					});
					return {
						dataState: DataState.LOADED,
						appData: { ...response, data: carrito },
					};
				}
				this.notificationService.onDefault(response.message);
				this.dataSubject.next(response);
				return { dataState: DataState.LOADED, appData: response };
			}),
			startWith({
				dataState: DataState.LOADING,
				appData: this.dataSubject.value,
			}),
			catchError((error: string) => {
				return of({
					dataState: DataState.ERROR,
					appData: this.dataSubject.value,
					error,
				});
			})
		);
	}

	removeFromCart(idProducto: number, cantidad?: number) {
		this.cartState$ = this.carritoService
			.removeFromCart$(idProducto, cantidad)
			.pipe(
				map((response) => {
					if (!response.message) {
						let carrito = JSON.parse(
							localStorage.getItem('carrito')
						);
						this.notificationService.onDefault(
							'Producto eliminado del carrito'
						);
						this.dataSubject.next({
							...response,
							data: carrito,
						});
						return {
							dataState: DataState.LOADED,
							appData: { ...response, data: carrito },
						};
					}
					this.notificationService.onDefault(response.message);
					this.dataSubject.next(response);
					return { dataState: DataState.LOADED, appData: response };
				}),
				startWith({
					dataState: DataState.LOADING,
					appData: { ...this.dataSubject.value },
				}),
				catchError((error: string) => {
					return of({
						dataState: DataState.ERROR,
						appData: this.dataSubject.value,
						error,
					});
				})
			);
	}
}
