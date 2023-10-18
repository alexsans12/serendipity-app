import {
	Component,
	ElementRef,
	HostListener,
	Input,
	OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Usuario } from '../../interface/usuario';
import { Carrito } from 'src/app/interface/carrito';
declare var bootstrap: any;

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
	@Input() usuario: Usuario;
	@Input() carrito: Carrito;

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
		if (
			localStorage.getItem('carrito') &&
			localStorage.getItem('carrito').includes('carritoProductos') &&
			!localStorage.getItem('[KEY] TOKEN') &&
			!localStorage.getItem('[KEY] REFRESH_TOKEN')
		) {
			let carrito = JSON.parse(localStorage.getItem('carrito'));
			this.carrito = carrito.carrito;
		}
	}

	logOut(): void {
		this.closeMenu();
		this.usuarioService.logOut();
		this.router.navigate(['/login']);
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
