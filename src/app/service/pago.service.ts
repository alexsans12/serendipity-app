import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomHttpResponse, Pay } from '../interface/appstates';
import { Observable, catchError, throwError } from 'rxjs';
import { Pago } from '../interface/pago';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class PagoService {
	private readonly server: string = environment.serendipity_api_url;

	constructor(private http: HttpClient) {}

	pagoById$ = (idPago: number) =>
		<Observable<CustomHttpResponse<Pay>>>(
			this.http
				.get<CustomHttpResponse<any>>(
					`${this.server}/pago/get/${idPago}`
				)
				.pipe(catchError(this.handleError))
		);

	createPago$ = (idMetodoPago: number, monto: number, estado: string) =>
		<Observable<CustomHttpResponse<Pay>>>(
			this.http
				.post<CustomHttpResponse<any>>(
					`${this.server}/pago/create`,
					{
						idMetodoPago,
						monto,
						estado,
					}
				)
				.pipe(catchError(this.handleError))
		);

	updatePago$ = (pago: Pago) =>
		<Observable<CustomHttpResponse<Pay>>>(
			this.http
				.put<CustomHttpResponse<any>>(
					`${this.server}/pago/update`,
					pago
				)
				.pipe(catchError(this.handleError))
		);

	deletePago$ = (pago: Pago) =>
		<Observable<CustomHttpResponse<Pay>>>(
			this.http
				.post<CustomHttpResponse<any>>(
					`${this.server}/pago/delete`,
					pago
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
