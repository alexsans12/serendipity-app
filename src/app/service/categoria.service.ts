import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomHttpResponse, Page } from '../interface/appstates';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Categoria } from '../interface/categoria';

@Injectable({
	providedIn: 'root',
})
export class CategoriaService {
	private readonly server: string = environment.serendipity_api_url;

	constructor(private http: HttpClient) {}

	categorias$ = () =>
		<Observable<CustomHttpResponse<Page<Categoria>>>>(
			this.http
				.get<CustomHttpResponse<any>>(
					`${this.server}/category/list`
				)
				.pipe(catchError(this.handleError))
		);

	allCategorias$ = (page: number = 0, size: number = 20) =>
		<Observable<CustomHttpResponse<Page<Categoria>>>>(
			this.http
				.get<CustomHttpResponse<Page<Categoria>>>(
					`${this.server}/category/list-all?page=${page}&size=${size}`
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
