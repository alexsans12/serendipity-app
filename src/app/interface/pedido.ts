import { Direccion } from "./direccion";
import { ProductoPedido } from "./productoPedido";

export interface Pedido {
	idPedido: number;
    idUsuario: number;
    idPago: number;
    idDireccion: number;
	direccion: Direccion;
	fechaCreacion: Date;
	total: number;
	estado: string;
	productosPedido: ProductoPedido[];
}
