import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Address, CustomHttpResponse } from '../interface/appstates';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Direccion } from '../interface/direccion';

@Injectable({
	providedIn: 'root',
})
export class DireccionService {
	private readonly server: string = 'http://192.168.0.8:9091/api/v1';

	constructor(private http: HttpClient) {}

	direccionesByUsuario$ = () =>
		<Observable<CustomHttpResponse<Address>>>(
			this.http
				.get<CustomHttpResponse<any>>(`${this.server}/direccion/get`)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	direccionById$ = (idDireccion: number) =>
		<Observable<CustomHttpResponse<Address>>>(
			this.http
				.get<CustomHttpResponse<any>>(
					`${this.server}/direccion/get/${idDireccion}`
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	addDireccion$ = (direccion: Direccion) =>
		<Observable<CustomHttpResponse<Address>>>(
			this.http
				.post<CustomHttpResponse<Address>>(
					`${this.server}/direccion/create`,
					direccion
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	updateDireccion$ = (direccion: Direccion) =>
		<Observable<CustomHttpResponse<Address>>>(
			this.http
				.put<CustomHttpResponse<Address>>(
					`${this.server}/direccion/update`,
					direccion
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	deleteDireccion$ = (direccion: Direccion) =>
		<Observable<CustomHttpResponse<Address>>>(
			this.http
				.post<CustomHttpResponse<Address>>(
					`${this.server}/direccion/delete`,
					direccion
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
