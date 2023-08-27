import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Usuario } from '../interface/usuario';
import { key } from '../enum/key.enum';

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
					`${this.server}/usuario/profile`
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	updateProfile$ = (usuario: Usuario) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.patch<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/update/profile`,
					usuario
				)
				.pipe(tap(console.log), catchError(this.handleError))
		);

	refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>this.http
			.get<CustomHttpResponse<Profile>>(
				`${this.server}/usuario/refresh/token`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							key.REFRESH_TOKEN
						)}`,
					},
				}
			)
			.pipe(
				tap((response) => {
					localStorage.removeItem(key.TOKEN);
					localStorage.removeItem(key.REFRESH_TOKEN);
					localStorage.setItem(key.TOKEN, response.data.access_token);
					localStorage.setItem(
						key.REFRESH_TOKEN,
						response.data.refresh_token
					);
				}),
				catchError(this.handleError)
			);

	updatePassword$ = (form: {
		currentPassword: string,
		newPassword: string,
		confirmNewPassword: string
	}) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.patch<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/update/password`, form
				)
				.pipe(
					tap(console.log),
					catchError(this.handleError)
				)
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
