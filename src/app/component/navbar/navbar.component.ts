import {Component, HostListener, OnInit} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
	currentRoute: string = "";
	isExpanded = false;
	isScrolled = false;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute
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

	ngOnInit(): void {}

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
}
