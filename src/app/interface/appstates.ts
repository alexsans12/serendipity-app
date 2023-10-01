import { DataState } from "../enum/datastate.enum";
import { Carrito } from "./carrito";
import { Eventos } from "./eventos";
import { Producto } from "./producto";
import { Rol } from "./rol";
import { Usuario } from "./usuario";

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
