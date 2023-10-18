import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Cart, CustomHttpResponse } from '../interface/appstates';
import { CarritoProducto } from '../interface/carritoProducto';
import { Producto } from '../interface/producto';

@Injectable({
	providedIn: 'root',
})
export class CarritoService {
	private readonly server: string = 'http://192.168.0.9:9091/api/v1';

	constructor(private http: HttpClient) {}

	cart$ = () => {
		if (this.usuarioNoAutenticado()) {
			const carrito = localStorage.getItem('carrito');
			return of(carrito ? JSON.parse(carrito) : null);
		}
		return <Observable<CustomHttpResponse<Cart>>>(
			this.http
				.get<CustomHttpResponse<any>>(`${this.server}/cart/get`)
				.pipe(tap(console.log), catchError(this.handleError))
		);
	};

	createCart$ = (carritoProductos: CarritoProducto[]) => {
		return <Observable<CustomHttpResponse<Cart>>>(
			this.http
				.post<CustomHttpResponse<any>>(`${this.server}/cart/create`, carritoProductos)
				.pipe(tap(console.log), catchError(this.handleError))
		);
	};

	addToCart$ = (producto: Producto, cantidad: number = 1) => {
		if (this.usuarioNoAutenticado()) {
			let carrito = localStorage.getItem('carrito');
			let carritoObj = carrito
				? JSON.parse(carrito)
				: {
						carrito: {
							idCarrito: null,
							idUsuario: null,
							carritoProductos: [],
						},
				  };

			// Busca si el producto ya está en el carrito
			const productoExistente = carritoObj.carrito.carritoProductos.find(
				(p) => p.idProducto === producto.idProducto
			);

			if (productoExistente) {
				// Si el producto ya está en el carrito, incrementa la cantidad
				productoExistente.cantidad += cantidad;
			} else {
				// Si el producto no está en el carrito, agrégalo
				const carritoProducto: CarritoProducto = {
					idCarritoProducto: null, // asignar un id adecuado
					idCarrito: null, // asignar un id adecuado
					idProducto: producto.idProducto,
					cantidad: cantidad,
					producto: producto,
				};
				carritoObj.carrito.carritoProductos.push(carritoProducto);
			}

			localStorage.setItem('carrito', JSON.stringify(carritoObj));
			return of(carritoObj);
		}
		return <Observable<CustomHttpResponse<Cart>>>this.http
			.post<CustomHttpResponse<Cart>>(`${this.server}/cart/add`, {
				idProducto: producto.idProducto,
				cantidad,
			})
			.pipe(tap(console.log), catchError(this.handleError));
	};

	removeFromCart$ = (idProducto: number, cantidad: number = 1) => {
		if (this.usuarioNoAutenticado()) {
			let carrito = localStorage.getItem('carrito');
			let carritoObj = carrito
				? JSON.parse(carrito)
				: {
						carrito: {
							idCarrito: null,
							idUsuario: null,
							carritoProductos: [],
						},
				};

			// Busca si el producto ya está en el carrito
			const productoExistente = carritoObj.carrito.carritoProductos.find(
				(p) => p.idProducto === idProducto
			);

			if (productoExistente) {
				// Si el producto ya está en el carrito, disminuye la cantidad
				productoExistente.cantidad -= cantidad;

				// Si la cantidad es 0 o negativa, elimina el producto del carrito
				if (productoExistente.cantidad <= 0) {
					carritoObj.carrito.carritoProductos = carritoObj.carrito.carritoProductos.filter(
						(p) => p.idProducto !== idProducto
					);
				}
			}

			localStorage.setItem('carrito', JSON.stringify(carritoObj));
			return of(carritoObj);
		}
		return <Observable<CustomHttpResponse<Cart>>>this.http
			.post<CustomHttpResponse<any>>(`${this.server}/cart/remove`, {
				idProducto,
				cantidad,
			})
			.pipe(tap(console.log), catchError(this.handleError));
	};

	private handleError(error: HttpErrorResponse): Observable<never> {
		let errorMessage: string;

		console.log(error);

		if (error.error instanceof ErrorEvent) {
			errorMessage = `Se produjo un error del cliente: ${error.error.message}`;
		} else {
			if (error.error.reason) {
				errorMessage = error.error.reason;
			} else {
				errorMessage = `Ocurrió un error: ${error.status} - ${error.statusText}`;
			}
		}

		return throwError(() => errorMessage);
	}

	private usuarioNoAutenticado(): boolean {
		// Retorna true si el usuario no está autenticado
		// Actualiza esta función según tu lógica de autenticación
		return (
			!localStorage.getItem('[KEY] TOKEN') ||
			!localStorage.getItem('[REFRESH] REFRESH_TOKEN')
		);
	}
}
