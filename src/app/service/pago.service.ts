import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomHttpResponse, Pay } from '../interface/appstates';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Pago } from '../interface/pago';

@Injectable({
	providedIn: 'root',
})
export class PagoService {
	private readonly server: string = 'http://192.168.0.9:9091/api/v1';

	constructor(private http: HttpClient) {}

	pagoById$ = (idPago: number) =>
		<Observable<CustomHttpResponse<Pay>>>(
			this.http
				.get<CustomHttpResponse<any>>(
					`${this.server}/pago/get/${idPago}`
				)
				.pipe(tap(console.log), catchError(this.handleError))
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
				.pipe(tap(console.log), catchError(this.handleError))
		);

	updatePago$ = (pago: Pago) =>
		<Observable<CustomHttpResponse<Pay>>>(
			this.http
				.put<CustomHttpResponse<any>>(
					`${this.server}/pago/update`,
					pago
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	deletePago$ = (pago: Pago) =>
		<Observable<CustomHttpResponse<Pay>>>(
			this.http
				.post<CustomHttpResponse<any>>(
					`${this.server}/pago/delete`,
					pago
				)
				.pipe(tap(console.log), catchError(this.handleError))
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
