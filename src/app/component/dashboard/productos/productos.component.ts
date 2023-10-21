import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { NotificationService } from 'src/app/service/notificacion.service';
import { ProductoService } from 'src/app/service/producto.service';

@Component({
	selector: 'app-productos',
	templateUrl: './productos.component.html',
	styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
	productoState$: Observable<State<CustomHttpResponse<Page>>>;
	private dataSubject: BehaviorSubject<CustomHttpResponse<Page>> =
		new BehaviorSubject<CustomHttpResponse<Page>>(null);
	private currentPageSubject = new BehaviorSubject<number>(0);
	currentPage$ = this.currentPageSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>(false);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	showLogs$ = this.showLogsSubject.asObservable();
	readonly DataState = DataState;

	constructor(
		private productoService: ProductoService,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.productoState$ = this.productoService.productos$(0, 5).pipe(
			map((response) => {
				this.dataSubject.next(response);
				console.log(response);
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
		this.productoState$ = this.productoService.productos$(pageNumber, 5).pipe(
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
