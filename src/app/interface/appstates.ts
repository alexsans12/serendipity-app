import { DataState } from "../enum/datastate.enum";
import { Carrito } from "./carrito";
import { Deseados } from "./deseados";
import { Eventos } from "./eventos";
import { Producto } from "./producto";
import { Rol } from "./rol";
import { Usuario } from "./usuario";
import { Departamento } from './departamento';
import { Municipio } from "./municipio";
import { Direccion } from "./direccion";
import { PaymentInfo } from "./paymentInfo";
import { Pedido } from "./pedido";
import { Pago } from "./pago";

export interface LoginState {
	dataState: DataState;
	loginSuccess?: boolean;
	error?: string;
	message?: string;
	isUsingMfa?: boolean;
	phone?: string;
}

export interface CustomHttpResponse<T> {
	timestamp: Date;
	statusCode: number;
	status: string;
	message: string;
	reason?: string;
	developerMessage?: string;
	data?: any;
}

export interface Profile {
	usuario: Usuario;
	eventos?: Eventos[];
	roles?: Rol[];
	access_token?: string;
	refresh_token?: string;
}

export interface RegisterState {
	dataState: DataState;
	registerSuccess?: boolean;
	error?: string;
	message?: string;
}

export type AccountType = 'account' | 'password';

export interface VerifyState {
	dataState: DataState;
	registerSuccess?: boolean;
	error?: string;
	message?: string;
	title?: string;
	type?: AccountType;
}

export interface Page {
	content: Producto[];
	totalPages: number;
	totalElements: number;
	numberOfElements: number;
	size: number;
	number: number;
	first: boolean;
	last: boolean;
}

export interface Cart {
	content: Carrito;
	error?: string;
	message?: string;
}

export interface Wish {
	content: Deseados;
	error?: string;
	message?: string;
}

export interface Department {
	content: Departamento;
	error?: string;
	message?: string;
}

export interface Municipality {
	content: Municipio;
	error?: string;
	message?: string;
}

export interface Address {
	content: Direccion;
	error?: string;
	message?: string;
}

export interface Checkout {
	content: PaymentInfo;
	error?: string;
	message?: string;
}

export interface Order {
	content: Pedido;
	error?: string;
	message?: string;
}

export interface Pay {
	content: Pago;
	error?: string;
	message?: string;
}
