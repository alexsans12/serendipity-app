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
import {
	Address,
	Cart,
	CustomHttpResponse,
	Department,
	Municipality,
	Profile,
} from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { NgForm } from '@angular/forms';
import { EventoType } from '../../../enum/evento-type.enum';
import { NotificationService } from 'src/app/service/notificacion.service';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/service/carrito.service';
import { Municipio } from 'src/app/interface/municipio';
import { DepartamentoService } from 'src/app/service/departamento.service';
import { MunicipioService } from 'src/app/service/municipio.service';
import { DireccionService } from 'src/app/service/direccion.service';
import { Direccion } from 'src/app/interface/direccion';

@Component({
	selector: 'app-usuario',
	templateUrl: './usuario.component.html',
	styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {
	profileState$: Observable<State<CustomHttpResponse<Profile>>>;
	cartState$: Observable<State<CustomHttpResponse<Cart>>>;
	direccionState$: Observable<State<CustomHttpResponse<Address>>>;
	departamentoState$: Observable<State<CustomHttpResponse<Department>>>;
	municipioState$: Observable<State<CustomHttpResponse<Municipality>>>;
	private dataSubject: BehaviorSubject<CustomHttpResponse<Profile>> =
		new BehaviorSubject<CustomHttpResponse<Profile>>(null);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>(false);
	showLogs$ = this.showLogsSubject.asObservable();
	readonly DataState = DataState;
	readonly EventoType = EventoType;

	selectedDepartment: number = 0;
	selectedMunicipality: number = 0;
	isEditing: boolean = false;
	municipios: Municipio[] = [];
	addressModel = {
		idDireccion: '',
		nombre: '',
		apellido: '',
		telefono: '',
		idDepartamento: '',
		idMunicipio: '',
		direccion: '',
		indicaciones: '',
	};

	constructor(
		private router: Router,
		private usuarioService: UsuarioService,
		private carritoService: CarritoService,
		private direccionService: DireccionService,
		private departamentoService: DepartamentoService,
		private municipioService: MunicipioService,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		if (!this.usuarioService.isAuthenticated()) {
			this.router.navigate(['/']);
		}
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

		this.cartState$ = this.carritoService.cart$().pipe(
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

		this.direccionState$ = this.direccionService
			.direccionesByUsuario$()
			.pipe(
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

		this.departamentoState$ = this.departamentoService
			.departamentos$()
			.pipe(
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
					this.notificationService.onDefault(response.message);
					this.dataSubject.next({ ...response, data: response.data });
					this.isLoadingSubject.next(false);
					return {
						dataState: DataState.LOADED,
						appData: this.dataSubject.value,
					};
				}),
				startWith({
					dataState: DataState.LOADING,
					appData: this.dataSubject.value,
				}),
				catchError((error: string) => {
					this.notificationService.onError(error);
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
		this.isLoadingSubject.next(true);
		if (
			passwordForm.value.newPassword ===
			passwordForm.value.confirmNewPassword
		) {
			this.profileState$ = this.usuarioService
				.updatePassword$(passwordForm.value)
				.pipe(
					map((response) => {
						this.notificationService.onDefault(response.message);
						this.dataSubject.next({
							...response,
							data: response.data,
						});
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
						this.notificationService.onError(error);
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
					this.notificationService.onDefault(response.message);
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
					this.notificationService.onError(error);
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
					this.notificationService.onDefault(response.message);
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
					this.notificationService.onError(error);
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
				this.notificationService.onDefault(response.message);
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
				this.notificationService.onError(error);
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
						this.notificationService.onDefault(response.message);
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
						this.notificationService.onError(error);
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

	onDepartmentChange(idDepartamento: number): void {
		this.selectedMunicipality = 0;

		this.municipioService
			.municipiosByIdDepartamento$(idDepartamento)
			.subscribe({
				next: (response) => {
					this.municipios = response.data.municipios;
				},
				error: (error) => {
					this.notificationService.onError(error);
				},
				complete: () => {
					this.notificationService.onDefault("Municipios cargados");
				},
			});
	}

	newAddress(): void {
		this.addressModel = {
			idDireccion: '',
			nombre: '',
			apellido: '',
			telefono: '',
			idDepartamento: '',
			idMunicipio: '',
			direccion: '',
			indicaciones: '',
		};
		this.isEditing = false;
		this.selectedDepartment = 0;
		this.selectedMunicipality = 0;
	}

	addAddress(addressForm: NgForm): void {
		this.isLoadingSubject.next(true);
		this.direccionState$ = this.direccionService
			.addDireccion$(addressForm.value)
			.pipe(
				map((response) => {
					this.notificationService.onDefault(response.message);
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
					this.notificationService.onError(error);
					this.isLoadingSubject.next(false);
					return of({
						dataState: DataState.LOADED,
						appData: this.dataSubject.value,
						error,
					});
				})
			);
	}

	editAddress(direccion: any): void {
		this.addressModel = { ...direccion };
		this.selectedDepartment =
			direccion.municipio.departamento.idDepartamento;
		this.onDepartmentChange(this.selectedDepartment);
		this.selectedMunicipality = direccion.municipio.idMunicipio;
		this.isEditing = true;
	}

	saveAddress(addressForm: NgForm): void {
		this.isLoadingSubject.next(true);
		this.direccionState$ = this.direccionService
			.updateDireccion$(addressForm.value)
			.pipe(
				map((response) => {
					this.notificationService.onDefault(response.message);
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
					this.notificationService.onError(error);
					this.isLoadingSubject.next(false);
					return of({
						dataState: DataState.LOADED,
						appData: this.dataSubject.value,
						error,
					});
				})
			);
	}

	deleteAddress(idDireccion: number): void {
		const direccion: Direccion = {
			idDireccion,
			nombre: '',
			apellido: '',
			telefono: 0,
			idDepartamento: 0,
			idMunicipio: 0,
		};

		this.isLoadingSubject.next(true);
		this.direccionState$ = this.direccionService
			.deleteDireccion$(direccion)
			.pipe(
				map((response) => {
					this.notificationService.onDefault(response.message);
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
					this.notificationService.onError(error);
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
