import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Usuario } from '../interface/usuario';

@Injectable({
	providedIn: 'root',
})
export class UsuarioService {
	private readonly server: string = 'http://localhost:9091/api/v1';

	constructor(private http: HttpClient) {}

	login$ = (email: string, password: string) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.post<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/login`,
					{ email, password }
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	verifyCode$ = (email: string, code: string) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.get<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/verify/code/${email}/${code}`
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	profile$ = () =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.get<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/profile`,
					{
						headers: new HttpHeaders().set(
							'Authorization',
							'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJDVVNUT01FUl9NQU5BR0VNRU5UX1NFUlZJQ0UiLCJzdWIiOiIxIiwiaXNzIjoiU0VSRU5ESVBJVFlfTExDIiwiZXhwIjoxNjkzMDMzODU0LCJpYXQiOjE2OTMwMzIwNTQsImF1dGhvcml0aWVzIjpbIlJFQUQ6VVNVQVJJTyIsIlJFQUQ6UFJPRFVDVE9TIiwiUkVBRDpQRURJRE9TIiwiUkVBRDpMSVNUQV9ERV9ERVNFT1MiLCJSRUFEOkNBUlJJVE8iLCJVUERBVEU6VVNVQVJJTyIsIkNSRUFURTpQRURJRE9TIl19.QnpJ5LWEuZHghCGyyiHyF_ERxYetef734RXW3oZDvcxmH2mOLJwKBdJez2SWd5eRhYNAzkBOeQtEPBt-wGTpPg'
						),
					}
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	updateProfile$ = (usuario: Usuario) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.patch<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/update/profile`, usuario,
					{
						headers: new HttpHeaders().set(
							'Authorization',
							'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJDVVNUT01FUl9NQU5BR0VNRU5UX1NFUlZJQ0UiLCJzdWIiOiIxIiwiaXNzIjoiU0VSRU5ESVBJVFlfTExDIiwiZXhwIjoxNjkzMDMzODU0LCJpYXQiOjE2OTMwMzIwNTQsImF1dGhvcml0aWVzIjpbIlJFQUQ6VVNVQVJJTyIsIlJFQUQ6UFJPRFVDVE9TIiwiUkVBRDpQRURJRE9TIiwiUkVBRDpMSVNUQV9ERV9ERVNFT1MiLCJSRUFEOkNBUlJJVE8iLCJVUERBVEU6VVNVQVJJTyIsIkNSRUFURTpQRURJRE9TIl19.QnpJ5LWEuZHghCGyyiHyF_ERxYetef734RXW3oZDvcxmH2mOLJwKBdJez2SWd5eRhYNAzkBOeQtEPBt-wGTpPg'
						),
					}
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	private handleError(error: HttpErrorResponse): Observable<never> {
		let errorMessage: string;

		console.log(error);

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
