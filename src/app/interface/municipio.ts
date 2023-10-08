import { Departamento } from './departamento';

export interface Municipio {
	idMunicipio: number;
    nombre: string;
	departamento: Departamento;
}
