import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
	BehaviorSubject,
	Observable,
	catchError,
	filter,
	map,
	of,
	startWith,
} from 'rxjs';
import { CustomHttpResponse, Profile } from 'src/app/interface/appstates';
import { UsuarioService } from 'src/app/service/usuario.service';
import { State } from 'src/app/interface/state';
import { DataState } from 'src/app/enum/datastate.enum';
declare var bootstrap: any;

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
	profileState$: Observable<State<CustomHttpResponse<Profile>>>;
	private dataSubject: BehaviorSubject<CustomHttpResponse<Profile>> =
		new BehaviorSubject<CustomHttpResponse<Profile>>(null);

	currentRoute: string = '';
	isExpanded = false;
	isScrolled = false;

	constructor(
		private el: ElementRef,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private usuarioService: UsuarioService
	) {
		// Filtra los eventos para recibir solo instancias de NavigationEnd
		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe(() => {
				// actualiza la ruta actual
				let active = this.activatedRoute;

				while (active.firstChild) {
					active = active.firstChild;
				}

				this.currentRoute = active.snapshot.url.join('/') || '/';
			});
	}

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

	@HostListener('window:scroll', [])
	onWindowScroll() {
		// Check if the viewport width is less than or equal to 992px
		if (window.innerWidth <= 992) {
			// Check if we've scrolled more than 0 pixels
			this.isScrolled = window.scrollY > 0;
		} else {
			this.isScrolled = false;
		}
	}

	closeMenu() {
		this.isExpanded = false; // Set Angular's tracking variable to false

		// Then close using Bootstrap's methods
		const myCollapse = new bootstrap.Collapse(
			this.el.nativeElement.querySelector('.collapse'),
			{
				toggle: false,
			}
		);
		myCollapse.hide();
	}
}
