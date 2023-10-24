import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { PedidoService } from '../../../service/pedido.service';
import { NotificationService } from 'src/app/service/notificacion.service';
import { Pedido } from 'src/app/interface/pedido';

@Component({
	selector: 'app-pedidos',
	templateUrl: './pedidos.component.html',
	styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
	pedidoState$: Observable<State<CustomHttpResponse<Page<Pedido>>>>;
	private dataSubject: BehaviorSubject<CustomHttpResponse<Page<Pedido>>> =
		new BehaviorSubject<CustomHttpResponse<Page<Pedido>>>(null);
	private currentPageSubject = new BehaviorSubject<number>(0);
	currentPage$ = this.currentPageSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>(false);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	showLogs$ = this.showLogsSubject.asObservable();
	readonly DataState = DataState;

	constructor(
		private pedidoService: PedidoService,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.pedidoState$ = this.pedidoService.pedidos$().pipe(
			map((response) => {
				this.dataSubject.next(response);
				this.notificationService.onDefault(response.message);
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
		this.pedidoState$ = this.pedidoService.pedidos$(pageNumber).pipe(
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
