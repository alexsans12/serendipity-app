import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { CustomHttpResponse, Municipality } from '../interface/appstates';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class MunicipioService {
	private readonly server: string = environment.serendipity_api_url;

	constructor(private http: HttpClient) {}

	municipios$ = () =>
		<Observable<CustomHttpResponse<Municipality>>>(
			this.http
				.get<CustomHttpResponse<any>>(`${this.server}/municipio/list`)
				.pipe(catchError(this.handleError))
		);

	municipiosByIdDepartamento$ = (idDepartamento: number) =>
		<Observable<CustomHttpResponse<Municipality>>>(
			this.http
				.get<CustomHttpResponse<any>>(`${this.server}/municipio/departamento/${idDepartamento}`)
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
