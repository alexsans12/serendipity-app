import { MetodoPago } from "./metodoPago";

export interface Pago {
	idPago: number;
    idMetodoPago: number;
    metodoPago: MetodoPago;
	monto: number;
	estado: string;
	fechaCreacion: Date;
}
