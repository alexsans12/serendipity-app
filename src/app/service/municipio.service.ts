import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Municipality } from '../interface/appstates';

@Injectable({
	providedIn: 'root',
})
export class MunicipioService {
	private readonly server: string = 'http://192.168.0.9:9091/api/v1';

	constructor(private http: HttpClient) {}

	municipios$ = () =>
		<Observable<CustomHttpResponse<Municipality>>>(
			this.http
				.get<CustomHttpResponse<any>>(`${this.server}/municipio/list`)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	municipiosByIdDepartamento$ = (idDepartamento: number) =>
		<Observable<CustomHttpResponse<Municipality>>>(
			this.http
				.get<CustomHttpResponse<any>>(`${this.server}/municipio/departamento/${idDepartamento}`)
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
