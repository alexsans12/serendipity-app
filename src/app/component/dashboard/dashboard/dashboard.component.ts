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
import { Cart, CustomHttpResponse, Profile } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { CarritoService } from 'src/app/service/carrito.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
	dashboardState$: Observable<State<CustomHttpResponse<Profile>>>;
	cartState$: Observable<State<CustomHttpResponse<Cart>>>;
	private dataSubject: BehaviorSubject<CustomHttpResponse<Profile>> =
		new BehaviorSubject<CustomHttpResponse<Profile>>(null);
	readonly DataState = DataState;

	constructor(
		private usuarioService: UsuarioService,
		private carritoService: CarritoService
	) {}

	ngOnInit(): void {
		this.dashboardState$ = this.usuarioService.profile$().pipe(
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

		this.cartState$ = this.carritoService.cart$().pipe(
			map((response) => {
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
