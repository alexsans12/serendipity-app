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
import { CustomHttpResponse, Stats } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { ClienteService } from '../../../service/cliente.service';

@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
	statsState$: Observable<State<CustomHttpResponse<Stats>>>;
	private dataSubject: BehaviorSubject<CustomHttpResponse<Stats>> =
		new BehaviorSubject<CustomHttpResponse<Stats>>(null);
	private currentPageSubject = new BehaviorSubject<number>(0);
	currentPage$ = this.currentPageSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>(false);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	showLogs$ = this.showLogsSubject.asObservable();
	readonly DataState = DataState;

	constructor(private clienteService: ClienteService) {}

	ngOnInit(): void {
		this.statsState$ = this.clienteService.stats$().pipe(
			map((response) => {
				this.dataSubject.next(response);
				console.log(response);
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
}
