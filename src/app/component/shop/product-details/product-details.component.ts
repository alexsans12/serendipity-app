import {
	Component,
	OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
	BehaviorSubject,
	Observable,
	catchError,
	map,
	of,
	startWith,
} from 'rxjs';
import { Location } from '@angular/common';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Page, Profile } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { Usuario } from 'src/app/interface/usuario';
import { ProductoService } from 'src/app/service/producto.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
	selector: 'app-product-details',
	templateUrl: './product-details.component.html',
	styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
	productState$: Observable<State<CustomHttpResponse<Page>>>;
	usuarioState$: Observable<State<CustomHttpResponse<Profile>>>;
	private dataSubject = new BehaviorSubject<
		CustomHttpResponse<Page & Usuario>
	>(null);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>(false);
	showLogs$ = this.showLogsSubject.asObservable();
	readonly DataState = DataState;
	mainImageUrl: string;

	constructor(
		private route: ActivatedRoute,
		private location: Location,
		private usuarioService: UsuarioService,
		private productoService: ProductoService
	) {}

	ngOnInit(): void {
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

		const currentUrlSegment = this.route.snapshot.url[2];

		this.productState$ = this.productoService
			.productoBySKU$(currentUrlSegment.path)
			.pipe(
				map((response) => {
					this.mainImageUrl = response.data.producto.imagenes[0].url;
					this.dataSubject.next(response);
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

	changeImage(imageSrc: string): void {
		this.mainImageUrl = imageSrc;
	}

	goBack() {
		this.location.back();
	}
}
