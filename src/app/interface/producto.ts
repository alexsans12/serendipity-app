import { ImagenProducto } from "./imagenProducto";

export interface Producto {
	idProducto: number;
    nombre: string;
    sku: string;
    descripcion: string;
    cantidad: number;
    precio: number;
    descuento: number;
    estado: boolean;
    imagenes: ImagenProducto[];
    idMarca: number;
    nombreMarca: string;
    urlImagenMarca: string;
    idCategoria: number;
    nombreCategoria: string;
    nombreCategoriaPadre: string;
    creadoPor: number;
    nombreCreadoPor: string;
    apellidoCreadoPor: string;
    fechaCreacion: Date;
    modificadoPor: number;
    nombreModificadoPor: string;
    apellidoModificadoPor: string;
    fechaModificacion: Date;
}
