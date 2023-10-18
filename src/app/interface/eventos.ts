import { EventoType } from "../enum/evento-type.enum";

export interface Eventos {
	idEvento: number;
	tipo: EventoType;
	descripcion: string;
	dispositivo: string;
    direccionIp: string;
    fechaCreacion: Date;
}
