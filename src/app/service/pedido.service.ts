import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomHttpResponse, Order } from '../interface/appstates';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Pedido } from '../interface/pedido';

@Injectable({
	providedIn: 'root',
})
export class PedidoService {
	private readonly server: string = 'http://192.168.0.9:9091/api/v1';

	constructor(private http: HttpClient) {}

	pedidos$ = (page: number = 0, size: number = 10) =>
		<Observable<CustomHttpResponse<Order>>>(
			this.http
				.get<CustomHttpResponse<any>>(
					`${this.server}/pedido/list?page=${page}&size=${size}`
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	pedidosByUsuario$ = (page: number = 0, size: number = 10) =>
		<Observable<CustomHttpResponse<Order>>>(
			this.http
				.get<CustomHttpResponse<any>>(
					`${this.server}/pedido/get?page=${page}&size=${size}`
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	pedidoById$ = (id: number) =>
		<Observable<CustomHttpResponse<Order>>>(
			this.http
				.get<CustomHttpResponse<any>>(
					`${this.server}/pedido/get/${id}`
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	createPedido$ = (idPago: number, idDireccion: number, estado: string) =>
		<Observable<CustomHttpResponse<Order>>>this.http
			.post<CustomHttpResponse<any>>(`${this.server}/pedido/create`, {
				idPago,
				idDireccion,
				estado,
			})
			.pipe(tap(console.log), catchError(this.handleError));

	updatePedido$ = (pedido: Pedido) =>
		<Observable<CustomHttpResponse<Order>>>(
			this.http
				.put<CustomHttpResponse<any>>(
					`${this.server}/pedido/update`,
					pedido
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	deletePedido$ = (pedido: Pedido) =>
		<Observable<CustomHttpResponse<Order>>>(
			this.http
				.post<CustomHttpResponse<any>>(
					`${this.server}/pedido/delete`,
					pedido
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
