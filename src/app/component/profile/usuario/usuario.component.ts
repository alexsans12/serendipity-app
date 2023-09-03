import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../service/usuario.service';
import {
	BehaviorSubject,
	Observable,
	catchError,
	map,
	of,
	startWith,
} from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Profile } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { NgForm } from '@angular/forms';
import { EventoType } from '../../../enum/evento-type.enum';

@Component({
	selector: 'app-usuario',
	templateUrl: './usuario.component.html',
	styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {
	profileState$: Observable<State<CustomHttpResponse<Profile>>>;
	private dataSubject: BehaviorSubject<CustomHttpResponse<Profile>> =
		new BehaviorSubject<CustomHttpResponse<Profile>>(null);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>(false);
	showLogs$ = this.showLogsSubject.asObservable();
	readonly DataState = DataState;
	readonly EventoType = EventoType;

	constructor(private usuarioService: UsuarioService) {}

	ngOnInit(): void {
		this.profileState$ = this.usuarioService.profile$().pipe(
			map((response) => {
				this.dataSubject.next(response);
				return { dataState: DataState.LOADED, appData: response };
			}),
			startWith({ dataState: DataState.LOADING }),
			catchError((error: string) => {
				return of({
					dataState: DataState.ERROR,
					appData: this.dataSubject.value,
					error,
				});
			})
		);
	}

	updateProfile(profileForm: NgForm): void {
		this.isLoadingSubject.next(true);
		this.profileState$ = this.usuarioService
			.updateProfile$(profileForm.value)
			.pipe(
				map((response) => {
					this.dataSubject.next({ ...response, data: response.data });
					this.isLoadingSubject.next(false);
					return {
						dataState: DataState.LOADED,
						appData: this.dataSubject.value,
					};
				}),
				startWith({
					dataState: DataState.LOADED,
					appData: this.dataSubject.value,
				}),
				catchError((error: string) => {
					this.isLoadingSubject.next(false);
					return of({
						dataState: DataState.LOADED,
						appData: this.dataSubject.value,
						error,
					});
				})
			);
	}

	updatePassword(passwordForm: NgForm): void {
		console.log(passwordForm.value);
		this.isLoadingSubject.next(true);
		if (
			passwordForm.value.newPassword ===
			passwordForm.value.confirmNewPassword
		) {
			this.profileState$ = this.usuarioService
				.updatePassword$(passwordForm.value)
				.pipe(
					map((response) => {
						this.dataSubject.next({ ...response, data: response.data });
						passwordForm.reset();
						this.isLoadingSubject.next(false);
						return {
							dataState: DataState.LOADED,
							appData: this.dataSubject.value,
						};
					}),
					startWith({
						dataState: DataState.LOADED,
						appData: this.dataSubject.value,
					}),
					catchError((error: string) => {
						passwordForm.reset();
						this.isLoadingSubject.next(false);
						return of({
							dataState: DataState.LOADED,
							appData: this.dataSubject.value,
							error,
						});
					})
				);
		} else {
			passwordForm.reset();
			this.isLoadingSubject.next(false);
		}
	}

	updateRol(rolForm: NgForm): void {
		this.isLoadingSubject.next(true);
		this.profileState$ = this.usuarioService
			.updateRol$(rolForm.value.rol)
			.pipe(
				map((response) => {
					this.dataSubject.next({ ...response, data: response.data });
					this.isLoadingSubject.next(false);
					return {
						dataState: DataState.LOADED,
						appData: this.dataSubject.value,
					};
				}),
				startWith({
					dataState: DataState.LOADED,
					appData: this.dataSubject.value,
				}),
				catchError((error: string) => {
					this.isLoadingSubject.next(false);
					return of({
						dataState: DataState.LOADED,
						appData: this.dataSubject.value,
						error,
					});
				})
			);
	}

	updateAccountSettings(settingsForm: NgForm): void {
		this.isLoadingSubject.next(true);
		this.profileState$ = this.usuarioService
			.updateAccountSettings$(settingsForm.value)
			.pipe(
				map((response) => {
					this.dataSubject.next({ ...response, data: response.data });
					this.isLoadingSubject.next(false);
					return {
						dataState: DataState.LOADED,
						appData: this.dataSubject.value,
					};
				}),
				startWith({
					dataState: DataState.LOADED,
					appData: this.dataSubject.value,
				}),
				catchError((error: string) => {
					this.isLoadingSubject.next(false);
					return of({
						dataState: DataState.LOADED,
						appData: this.dataSubject.value,
						error,
					});
				})
			);
	}

	toggleMfa(): void {
		this.isLoadingSubject.next(true);
		this.profileState$ = this.usuarioService.toggleMfa$().pipe(
			map((response) => {
				this.dataSubject.next({ ...response, data: response.data });
				this.isLoadingSubject.next(false);
				return {
					dataState: DataState.LOADED,
					appData: this.dataSubject.value,
				};
			}),
			startWith({
				dataState: DataState.LOADED,
				appData: this.dataSubject.value,
			}),
			catchError((error: string) => {
				this.isLoadingSubject.next(false);
				return of({
					dataState: DataState.LOADED,
					appData: this.dataSubject.value,
					error,
				});
			})
		);
	}

	updatePicture(event: Event): void {
		const target = event.target as HTMLInputElement;
		const image = target?.files?.[0];
		if (image) {
			this.isLoadingSubject.next(true);
			this.profileState$ = this.usuarioService
				.updateImage$(this.getFormData(image))
				.pipe(
					map((response) => {
						this.dataSubject.next({
							...response,
							data: {
								...response.data,
								usuario: {
									...response.data.usuario,
									urlFoto: `${
										response.data.usuario.urlFoto
									}?time=${new Date().getTime()}`,
								},
							},
						});
						this.isLoadingSubject.next(false);
						return {
							dataState: DataState.LOADED,
							appData: this.dataSubject.value,
						};
					}),
					startWith({
						dataState: DataState.LOADED,
						appData: this.dataSubject.value,
					}),
					catchError((error: string) => {
						this.isLoadingSubject.next(false);
						return of({
							dataState: DataState.LOADED,
							appData: this.dataSubject.value,
							error,
						});
					})
				);
		}
	}

	toggleLogs(): void {
		this.showLogsSubject.next(!this.showLogsSubject.value);
	}

	private getFormData(image: File): FormData {
		const formData = new FormData();
		formData.append('image', image);
		return formData;
	}
}
