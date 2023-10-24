import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { Cart, CustomHttpResponse, Page, Profile, Wish } from 'src/app/interface/appstates';
import { Producto } from 'src/app/interface/producto';
import { State } from 'src/app/interface/state';
import { CarritoService } from 'src/app/service/carrito.service';
import { DeseadosService } from 'src/app/service/deseados.service';
import { NotificationService } from 'src/app/service/notificacion.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
	selector: 'app-wish-list',
	templateUrl: './wish-list.component.html',
	styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent implements OnInit {
	wishState$: Observable<State<CustomHttpResponse<Wish>>>;
	usuarioState$: Observable<State<CustomHttpResponse<Profile>>>;
	cartState$: Observable<State<CustomHttpResponse<Cart>>>;
	private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Producto>>>(null);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>(false);
	showLogs$ = this.showLogsSubject.asObservable();
	readonly DataState = DataState;

	constructor(
		private usuarioService: UsuarioService,
		private deseadosService: DeseadosService,
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

		this.wishState$ = this.deseadosService.wishList$().pipe(
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

	removeFromWishlist(idProducto: number) {
		this.wishState$ = this.deseadosService
			.removeFromWishList$(idProducto)
			.pipe(
				map((response) => {
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
