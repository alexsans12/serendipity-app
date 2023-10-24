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
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { Usuario } from 'src/app/interface/usuario';
import { ClienteService } from 'src/app/service/cliente.service';
import { NotificationService } from 'src/app/service/notificacion.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
	clienteState$: Observable<State<CustomHttpResponse<Page<Usuario>>>>;
	private dataSubject: BehaviorSubject<CustomHttpResponse<Page<Usuario>>> =
		new BehaviorSubject<CustomHttpResponse<Page<Usuario>>>(null);
	private currentPageSubject = new BehaviorSubject<number>(0);
	currentPage$ = this.currentPageSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>(false);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	showLogs$ = this.showLogsSubject.asObservable();
	readonly DataState = DataState;

	constructor(
		private clienteService: ClienteService,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.clienteState$ = this.clienteService.clientes$().pipe(
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
		this.clienteState$ = this.clienteService
			.clientes$(pageNumber)
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
