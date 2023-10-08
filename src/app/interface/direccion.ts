import { Municipio } from "./municipio";

export interface Direccion {
	idDireccion?: number;
	nombre: string;
	apellido: string;
	telefono: number;
	idDepartamento: number;
	idMunicipio: number;
	municipio?: Municipio;
}
