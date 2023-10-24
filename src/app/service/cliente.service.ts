import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse, Page, Stats } from '../interface/appstates';
import { Usuario } from '../interface/usuario';

@Injectable({
	providedIn: 'root',
})
export class ClienteService {
	private readonly server: string = environment.serendipity_api_url;

	constructor(private http: HttpClient) {}

	clientes$ = (page: number = 0, size: number = 10) =>
		<Observable<CustomHttpResponse<Page<Usuario>>>>(
			this.http
				.get<CustomHttpResponse<Page<Usuario>>>(
					`${this.server}/clientes/list?page=${page}&size=${size}`
				)
				.pipe(catchError(this.handleError))
		);

	stats$ = () =>
		<Observable<CustomHttpResponse<Stats>>>(
			this.http
				.get<CustomHttpResponse<Stats>>(
					`${this.server}/clientes/stats`
				)
				.pipe(catchError(this.handleError))
		);

	private handleError(error: HttpErrorResponse): Observable<null | never> {
		let errorMessage: string;

		if (error.error instanceof ErrorEvent) {
			errorMessage = `A client error occurred: ${error.error.message}`;
		} else {
			if (error.error.reason) {
				errorMessage = error.error.reason;
			} else {
				errorMessage = `An error occurred: ${error.status} - ${error.statusText}`;
			}
		}

		return throwError(() => errorMessage);
	}
}
