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
import { CarritoService } from 'src/app/service/carrito.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { PedidoService } from '../../../service/pedido.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-orders',
	templateUrl: './orders.component.html',
	styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
	cartState$: Observable<State<CustomHttpResponse<Cart>>>;
	usuarioState$: Observable<State<CustomHttpResponse<Profile>>>;
	ordersState$: Observable<State<CustomHttpResponse<Page>>>;
	private dataSubject = new BehaviorSubject<CustomHttpResponse<Page>>(null);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	private currentPageSubject = new BehaviorSubject<number>(0);
	currentPage$ = this.currentPageSubject.asObservable();
	readonly DataState = DataState;

	constructor(
		private router: Router,
		private usuarioService: UsuarioService,
		private carritoService: CarritoService,
		private pedidoService: PedidoService
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

		this.ordersState$ = this.pedidoService.pedidosByUsuario$().pipe(
			map((response) => {
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

	goToPage(pageNumber?: number) {
		this.ordersState$ = this.pedidoService
			.pedidosByUsuario$(pageNumber)
			.pipe(
				map((response) => {
					this.dataSubject.next(response);
					this.currentPageSubject.next(pageNumber);
					return {
						dataState: DataState.LOADED,
						appData: response,
					};
				}),
				startWith({
					dataState: DataState.LOADING,
					apData: this.dataSubject.value,
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

	goToNextOrPreviousPage(direction?: string) {
		this.goToPage(
			direction === 'forward'
				? this.currentPageSubject.value + 1
				: this.currentPageSubject.value - 1
		);
	}
}
