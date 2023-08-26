import { DataState } from "../enum/datastate.enum";
import { Eventos } from "./eventos";
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
