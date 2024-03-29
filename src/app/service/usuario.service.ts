import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	AccountType,
	CustomHttpResponse,
	Profile
} from '../interface/appstates';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../interface/usuario';
import { key } from '../enum/key.enum';
import { environment } from 'src/environments/environment';

@Injectable()
export class UsuarioService {
	private readonly server: string = environment.serendipity_api_url;
	private jwtHelper = new JwtHelperService();

	constructor(private http: HttpClient) {}

	login$ = (email: string, password: string) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.post<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/login`,
					{ email, password }
				)
				.pipe(catchError(this.handleError))
		);

	requestPasswordReset$ = (email: string) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.get<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/reset-password/${email}`
				)
				.pipe(catchError(this.handleError))
		);

	register$ = (usuario: Usuario) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.post<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/register`,
					usuario
				)
				.pipe(catchError(this.handleError))
		);

	verifyCode$ = (email: string, code: string) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.get<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/verify/code/${email}/${code}`
				)
				.pipe(catchError(this.handleError))
		);

	verify$ = (key: string, type: AccountType) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.get<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/verify/${type}/${key}`
				)
				.pipe(catchError(this.handleError))
		);

	renewPassword$ = (form: {
		idUsuario: number;
		password: string;
		confirmPassword: string;
	}) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.put<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/new/password`,
					form
				)
				.pipe(catchError(this.handleError))
		);

	profile$ = () =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.get<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/profile`
				)
				.pipe(catchError(this.handleError))
		);

	updateProfile$ = (usuario: Usuario) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.patch<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/update/profile`,
					usuario
				)
				.pipe(catchError(this.handleError))
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
		currentPassword: string;
		newPassword: string;
		confirmNewPassword: string;
	}) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.patch<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/update/password`,
					form
				)
				.pipe(catchError(this.handleError))
		);

	updateRol$ = (rol: string) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.patch<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/update/rol/${rol}`,
					{}
				)
				.pipe(catchError(this.handleError))
		);

	updateAccountSettings$ = (settings: { enabled: Boolean }) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.patch<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/update/settings`,
					settings
				)
				.pipe(catchError(this.handleError))
		);

	toggleMfa$ = () =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.patch<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/toggle/mfa`,
					{}
				)
				.pipe(catchError(this.handleError))
		);

	updateImage$ = (formData: FormData) =>
		<Observable<CustomHttpResponse<Profile>>>(
			this.http
				.patch<CustomHttpResponse<Profile>>(
					`${this.server}/usuario/update/image`,
					formData
				)
				.pipe(catchError(this.handleError))
		);

	logOut() {
		localStorage.removeItem(key.TOKEN);
		localStorage.removeItem(key.REFRESH_TOKEN);
	}

	isAuthenticated = (): boolean =>
		this.jwtHelper.decodeToken<string>(localStorage.getItem(key.TOKEN)) &&
		!this.jwtHelper.isTokenExpired(localStorage.getItem(key.TOKEN))
			? true
			: false;

	private handleError(error: HttpErrorResponse): Observable<null | never> {
		let errorMessage: string;

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
