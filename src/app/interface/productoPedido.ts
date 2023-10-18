import { Producto } from "./producto";

export interface ProductoPedido {
	idPedidoProducto: number;
    idPedido: number;
	idProducto: number;
	cantidad: number;
	precio: number;
	subtotal: number;
	producto: Producto;
}
