import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../service/usuario.service';
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

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	homeState$: Observable<State<CustomHttpResponse<Profile>>>;
	cartState$: Observable<State<CustomHttpResponse<Cart>>>;
	private dataSubject: BehaviorSubject<CustomHttpResponse<Profile>> =
		new BehaviorSubject<CustomHttpResponse<Profile>>(null);
	readonly DataState = DataState;

	constructor(
		private usuarioService: UsuarioService,
		private carritoService: CarritoService
	) {}

	ngOnInit(): void {
		if (this.usuarioService.isAuthenticated()) {
			this.homeState$ = this.usuarioService.profile$().pipe(
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
