import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { CustomHttpResponse, Page } from '../interface/appstates';
import { Usuario } from '../interface/usuario';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ProductoService {
	private readonly server: string = environment.serendipity_api_url;

	constructor(private http: HttpClient) {}

	productos$ = (page: number = 0, size: number = 20) =>
		<Observable<CustomHttpResponse<Page & Usuario>>>(
			this.http
				.get<CustomHttpResponse<Page & Usuario>>(
					`${this.server}/producto/list?page=${page}&size=${size}`
				)
				.pipe(catchError(this.handleError))
		);

	productosByCategoria$ = (
		nombre: string,
		page: number = 0,
		size: number = 20
	) =>
		<Observable<CustomHttpResponse<Page & Usuario>>>(
			this.http
				.get<CustomHttpResponse<Page & Usuario>>(
					`${this.server}/producto/categoria?nombre=${nombre}&page=${page}&size=${size}`
				)
				.pipe(catchError(this.handleError))
		);

	searchProducto$ = (nombre: string, page: number = 0, size: number = 20) =>
		<Observable<CustomHttpResponse<Page & Usuario>>>(
			this.http
				.get<CustomHttpResponse<any>>(
					`${this.server}/producto/search?nombre=${nombre}&page=${page}&size=${size}`
				)
				.pipe(catchError(this.handleError))
		);

	productoByCode$ = (sku: string) =>
		<Observable<CustomHttpResponse<Page & Usuario>>>(
			this.http
				.get<CustomHttpResponse<any>>(
					`${this.server}/producto/sku/${sku}`
				)
				.pipe(catchError(this.handleError))
		);

	private handleError(error: HttpErrorResponse): Observable<never> {
		let errorMessage: string;

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
