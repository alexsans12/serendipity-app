import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { LoginState } from '../../interface/appstates';
import { DataState } from 'src/app/enum/datastate.enum';
import { key } from 'src/app/enum/key.enum';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	loginState$: Observable<LoginState> = of({ dataState: DataState.LOADED });
	private phoneSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	private emailSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	readonly DataState = DataState;

	constructor(private router: Router, private usuarioService: UsuarioService) {}

	ngOnInit(): void {
		this.usuarioService.isAuthenticated() ? this.router.navigate(['/']) : this.loginPage();
	}

	login(loginForm: NgForm): void {
		this.loginState$ = this.usuarioService.login$(loginForm.value.email, loginForm.value.password)
		.pipe(map(response => {
			if (response.data.usuario.utilizaMfa) {
				this.phoneSubject.next(response.data.usuario.telefono);
				this.emailSubject.next(response.data.usuario.email);
				return { dataState: DataState.LOADED, isUsingMfa: true, loginSuccess: false, phone: response.data.usuario.telefono.substring(response.data.usuario.telefono.length - 4) };
			} else {
				localStorage.setItem(key.TOKEN, response.data.access_token);
				localStorage.setItem(key.REFRESH_TOKEN, response.data.refresh_token);
				this.router.navigate(['/']);
				return { dataState: DataState.LOADED, loginSuccess: true};
			}
		}),
			startWith({ dataState: DataState.LOADING, isUsingMfa: false }),
			catchError((error: string) => {
				return of({ dataState: DataState.ERROR, isUsingMfa: false, loginSuccess: false, error });
			})
		);
	}

	verifyCode(verifyCodeForm: NgForm): void {
		if (verifyCodeForm.invalid || !this.emailSubject.value || !this.phoneSubject.value) {
			return;
		}
		this.loginState$ = this.usuarioService.verifyCode$(this.emailSubject.value, verifyCodeForm.value.code)
		.pipe(
			map(response => {
				localStorage.setItem(key.TOKEN, response.data.access_token);
				localStorage.setItem(key.REFRESH_TOKEN, response.data.refresh_token);
				this.router.navigate(['/']);
				return { dataState: DataState.LOADED, loginSuccess: true};
			}),
			startWith({ dataState: DataState.LOADING, isUsingMfa: true, loginSuccess: false, phone: this.phoneSubject.value.substring(this.phoneSubject.value.length - 4)  }),
			catchError((error: string) => {
				return of({ dataState: DataState.ERROR, isUsingMfa: true, loginSuccess: false, error, phone: this.phoneSubject.value?.substring(this.phoneSubject.value.length - 4)  });
			})
		);
	}

	loginPage(): void {
		this.loginState$ = of({ dataState: DataState.LOADED });
	}
}
