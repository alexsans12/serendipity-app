import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { PedidoService } from 'src/app/service/pedido.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { NotificationService } from 'src/app/service/notificacion.service';
import { Location } from '@angular/common';

// Registrar los datos de configuración regional
registerLocaleData(localeEs);

@Component({
	selector: 'app-order-details',
	templateUrl: './order-details.component.html',
	styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
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
		private route: ActivatedRoute,
		private location: Location,
		private usuarioService: UsuarioService,
		private carritoService: CarritoService,
		private pedidoService: PedidoService,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		const currentUrlSegment = this.route.snapshot.url[1];

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

		this.ordersState$ = this.pedidoService.pedidoById$(Number(currentUrlSegment.path)).pipe(
			map((response) => {
				this.dataSubject.next(response);
				return { dataState: DataState.LOADED, appData: response };
			}),
			startWith({ dataState: DataState.LOADING }),
			catchError((error: string) => {
				this.notificationService.onError("El pedido no existe");
				this.router.navigate(['/orders']);
				return of({
					dataState: DataState.ERROR,
					appData: this.dataSubject.value,
					error,
				});
			})
		);
	}

	goBack() {
		this.location.back();
	}
}
