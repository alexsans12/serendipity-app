import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Address, CustomHttpResponse } from '../interface/appstates';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Direccion } from '../interface/direccion';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class DireccionService {
	private readonly server: string = environment.serendipity_api_url;

	constructor(private http: HttpClient) {}

	direccionesByUsuario$ = () =>
		<Observable<CustomHttpResponse<Address>>>(
			this.http
				.get<CustomHttpResponse<any>>(`${this.server}/direccion/get`)
				.pipe(catchError(this.handleError))
		);

	direccionById$ = (idDireccion: number) =>
		<Observable<CustomHttpResponse<Address>>>(
			this.http
				.get<CustomHttpResponse<any>>(
					`${this.server}/direccion/get/${idDireccion}`
				)
				.pipe(catchError(this.handleError))
		);

	addDireccion$ = (direccion: Direccion) =>
		<Observable<CustomHttpResponse<Address>>>(
			this.http
				.post<CustomHttpResponse<Address>>(
					`${this.server}/direccion/create`,
					direccion
				)
				.pipe(catchError(this.handleError))
		);

	updateDireccion$ = (direccion: Direccion) =>
		<Observable<CustomHttpResponse<Address>>>(
			this.http
				.put<CustomHttpResponse<Address>>(
					`${this.server}/direccion/update`,
					direccion
				)
				.pipe(catchError(this.handleError))
		);

	deleteDireccion$ = (direccion: Direccion) =>
		<Observable<CustomHttpResponse<Address>>>(
			this.http
				.post<CustomHttpResponse<Address>>(
					`${this.server}/direccion/delete`,
					direccion
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
