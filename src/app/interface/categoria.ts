export interface Categoria {
	idCategoria: number;
    idCategoriaPadre: number;
    nombre: string;
    descripcion: string;
    // Usuario que creo la categoria
    creadoPor: number;
    nombreCreadoPor: string;
    apellidoCreadoPor: string;
    fechaCreacion: Date;
    // Usuario que modifico la categoria
    modificadoPor: number;
    nombreModificadoPor: string;
    apellidoModificadoPor: string;
    fechaModificacion: Date;
    categoriaPadre: Categoria;
}
