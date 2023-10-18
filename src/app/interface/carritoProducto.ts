import { Producto } from "./producto";

export interface CarritoProducto {
	idCarritoProducto: number;
    idCarrito: number;
    idProducto: number;
    cantidad: number;
    producto: Producto;
}
