import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../service/producto.service';
import { CustomHttpResponse, Page, Profile } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import {
	BehaviorSubject,
	Observable,
	catchError,
	map,
	of,
	startWith,
} from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Usuario } from 'src/app/interface/usuario';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
	productListState$: Observable<State<CustomHttpResponse<Page & Usuario>>>;
	usuarioState$: Observable<State<CustomHttpResponse<Profile>>>;
	private dataSubject = new BehaviorSubject<
		CustomHttpResponse<Page & Usuario>
	>(null);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	private currentPageSubject = new BehaviorSubject<number>(0);
	currentPage$ = this.currentPageSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>(false);
	showLogs$ = this.showLogsSubject.asObservable();
	readonly DataState = DataState;
	categoriaUrl: string;

	constructor(
		private route: ActivatedRoute,
		private cdRef: ChangeDetectorRef,
		private usuarioService: UsuarioService,
		private productoService: ProductoService
	) {}

	ngOnInit(): void {
		this.route.url.subscribe((urlSegments) => {
			// Handle URL changes here
			this.handleUrlChange(urlSegments);
		});

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

	goToPage(pageNumber?: number) {
		const currentUrlSegment = this.route.snapshot.url[2];

		if (currentUrlSegment !== undefined) {
			this.productListState$ = this.productoService
				.productosByCategoria$(currentUrlSegment.path, pageNumber)
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
		} else {
			this.productListState$ = this.productoService
				.productos$(pageNumber)
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
	}

	goToNextOrPreviousPage(direction?: string) {
		this.goToPage(
			direction === 'forward'
				? this.currentPageSubject.value + 1
				: this.currentPageSubject.value - 1
		);
	}

	private handleUrlChange(urlSegments: UrlSegment[]) {
		const currentUrlSegment = urlSegments[2];
		this.categoriaUrl = currentUrlSegment?.path;
		// Add your logic to update data based on the URL here
		if (currentUrlSegment !== undefined) {
			this.productListState$ = this.productoService
				.productosByCategoria$(currentUrlSegment.path)
				.pipe(
					map((response) => {
						this.dataSubject.next(response);
						return {
							dataState: DataState.LOADED,
							appData: response,
						};
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
		} else {
			this.productListState$ = this.productoService.productos$().pipe(
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
		// After updating data, manually trigger change detection
		this.cdRef.detectChanges();
	}

	searchProducto(searchForm: NgForm) {
		const nombre = searchForm.controls['search'].value;
		this.productListState$ = this.productoService
			.searchProducto$(nombre)
			.pipe(
				map((response) => {
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
}
