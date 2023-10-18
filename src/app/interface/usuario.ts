export interface Usuario {
	idUsuario: number;
	nombre: string;
	apellido: string;
	urlFoto?: string;
	email: string;
	telefono?: string;
	creadoPor: number;
	fechaCreacion: Date;
	modificadoPor?: number;
	fechaModificacion?: Date;
	utilizaMfa: boolean;
	estado: boolean;
	rol: string;
	permisos: string;
}
