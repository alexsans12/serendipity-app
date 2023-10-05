import { ProductoDeseado } from "./productoDeseado";

export interface Deseados {
	idListaDeseos: number;
    idUsuario: number;
    productosDeseados: ProductoDeseado[];
}
