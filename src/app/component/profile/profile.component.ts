import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
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

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
	profileState$: Observable<State<CustomHttpResponse<Profile>>>;
	private dataSubject: BehaviorSubject<CustomHttpResponse<Profile>> =
		new BehaviorSubject<CustomHttpResponse<Profile>>(null);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	readonly DataState = DataState;

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
		console.log(rolForm);
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
}
