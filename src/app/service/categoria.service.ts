import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomHttpResponse, Page } from '../interface/appstates';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CategoriaService {
	private readonly server: string = 'http://192.168.0.2:9091/api/v1';

	constructor(private http: HttpClient) {}

	categorias$ = () =>
		<Observable<CustomHttpResponse<Page>>>(
			this.http
				.get<CustomHttpResponse<any>>(
					`${this.server}/categoria/list`
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	allCategorias$ = (page: number = 0, size: number = 20) =>
		<Observable<CustomHttpResponse<any>>>(
			this.http
				.get<CustomHttpResponse<any>>(
					`${this.server}/categoria/list-all?page=${page}&size=${size}`
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

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
