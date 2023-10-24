import { Pedido } from './../../../interface/pedido';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { Cart, CustomHttpResponse, Profile } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { CarritoService } from 'src/app/service/carrito.service';
import { NotificationService } from 'src/app/service/notificacion.service';
import { PedidoService } from 'src/app/service/pedido.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
	selector: 'app-pedido-detail',
	templateUrl: './pedido-detail.component.html',
	styleUrls: ['./pedido-detail.component.scss'],
})
export class PedidoDetailComponent implements OnInit {
		orderState$: Observable<State<CustomHttpResponse<Pedido>>>;
		profileState$: Observable<State<CustomHttpResponse<Profile>>>;
		cartState$: Observable<State<CustomHttpResponse<Cart>>>;
		private dataSubject: BehaviorSubject<CustomHttpResponse<any>> =
			new BehaviorSubject<CustomHttpResponse<any>>(null);
		private isLoadingSubject = new BehaviorSubject<boolean>(false);
		isLoading$ = this.isLoadingSubject.asObservable();
		private showLogsSubject = new BehaviorSubject<boolean>(false);
		showLogs$ = this.showLogsSubject.asObservable();
		readonly DataState = DataState;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private usuarioService: UsuarioService,
		private carritoService: CarritoService,
		private pedidoService: PedidoService,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		const currentUrlSegment = this.route.snapshot.url[2];

		this.profileState$ = this.usuarioService.profile$().pipe(
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

		this.cartState$ = this.carritoService.cart$().pipe(
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

		this.orderState$ = this.pedidoService.pedidoById$(Number(currentUrlSegment.path)).pipe(
			map((response) => {
				console.log(response);
				this.dataSubject.next(response);
				return { dataState: DataState.LOADED, appData: response };
			}),
			startWith({ dataState: DataState.LOADING }),
			catchError((error: string) => {
				this.router.navigate(['/dashboard'], { fragment: 'orders' });
				return of({
					dataState: DataState.ERROR,
					appData: this.dataSubject.value,
					error,
				});
			})
		);
	}

	updateEstado(nuevoEstado: string): void {
		const pedido: Pedido = this.dataSubject.value.data.pedido;
		pedido.estado = nuevoEstado;
		this.orderState$ = this.pedidoService.updatePedido$(pedido).pipe(
			map((response) => {
				console.log(response);
				this.notificationService.onSuccess(response.message);
				this.dataSubject.next(response);
				return { dataState: DataState.LOADED, appData: response };
			}),
			startWith({ dataState: DataState.LOADING }),
			catchError((error: string) => {
				this.notificationService.onError(error);
				return of({
					dataState: DataState.ERROR,
					appData: this.dataSubject.value,
					error,
				});
			})
		);
	}

	goBack(): void {
		this.router.navigate(["/dashboard"], { fragment: 'orders' });
	}
}
