import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Checkout, CustomHttpResponse, } from '../interface/appstates';
import { PaymentInfo } from '../interface/paymentInfo';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class CheckoutService {
	private readonly server: string = environment.serendipity_api_url;

	constructor(private http: HttpClient) {}

	paymentIntent$ = (paymentInfo: PaymentInfo) =>
		<Observable<CustomHttpResponse<Checkout>>>(
			this.http
				.post<CustomHttpResponse<any>>(
					`${this.server}/checkout/payment-intent`,
					paymentInfo
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
