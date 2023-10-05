import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Wish } from '../interface/appstates';
import { ProductoDeseado } from '../interface/productoDeseado';
import { Producto } from '../interface/producto';

@Injectable({
	providedIn: 'root',
})
export class DeseadosService {
	private readonly server: string = 'http://192.168.0.8:9091/api/v1';

	constructor(private http: HttpClient) {}

	wishList$ = () => {
		return <Observable<CustomHttpResponse<Wish>>>(
			this.http
				.get<CustomHttpResponse<any>>(`${this.server}/wish/get`)
				.pipe(tap(console.log), catchError(this.handleError))
		);
	};

	createWishList$ = (productoDeseado: ProductoDeseado[]) => {
		return <Observable<CustomHttpResponse<Wish>>>(
			this.http
				.post<CustomHttpResponse<any>>(
					`${this.server}/wish/create`,
					productoDeseado
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);
	};

	addToWishList$ = (idProducto: number) => {
		return <Observable<CustomHttpResponse<Wish>>>this.http
			.post<CustomHttpResponse<Wish>>(`${this.server}/wish/add`, {
				idProducto
			})
			.pipe(tap(console.log), catchError(this.handleError));
	};

	removeFromWishList$ = (idProducto: number) => {
		return <Observable<CustomHttpResponse<Wish>>>this.http
			.post<CustomHttpResponse<any>>(`${this.server}/wish/remove`, {
				idProducto
			})
			.pipe(tap(console.log), catchError(this.handleError));
	};

	isInWishlist$ = (SKU: string) => {
		return <Observable<CustomHttpResponse<Wish>>>this.http
			.get<CustomHttpResponse<Wish>>(`${this.server}/wish/producto/${SKU}`)
			.pipe(tap(console.log), catchError(this.handleError));
	};

	private handleError(error: HttpErrorResponse): Observable<never> {
		let errorMessage: string;

		console.log(error);

		if (error.error instanceof ErrorEvent) {
			errorMessage = `Se produjo un error del cliente: ${error.error.message}`;
		} else {
			if (error.error.reason) {
				errorMessage = error.error.reason;
			} else {
				errorMessage = `Ocurrió un error: ${error.status} - ${error.statusText}`;
			}
		}

		return throwError(() => errorMessage);
	}
}
