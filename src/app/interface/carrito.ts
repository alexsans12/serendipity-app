import { CarritoProducto } from "./carritoProducto";

export interface Carrito {
	idCarrito: number;
    idUsuario: number;
    carritoProductos: CarritoProducto[];
}
