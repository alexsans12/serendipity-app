import { Producto } from "./producto";

export interface ProductoDeseado {
	idProductoLista: number;
    idListaDeseos: number;
    idProducto: number;
    producto: Producto;
}
