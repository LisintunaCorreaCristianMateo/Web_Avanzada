//En el controlador funcina el modelos de negocio
import ProductoModel, { Producto } from "../models/productoModel.js";
import { vistaProductos, vistaDetalleProducto, vistaFormularioEdicion,vistaNuevoProducto } from "../views/productoView.js";

//funcion para listar todos los productos
export const listatProductos = (req, res) => {
    const productos = ProductoModel.obtenerTodos();
    //genera la vista
    res.type("html").send(vistaProductos(productos));

}
export const mostarProductoIndividual = (req, res) => {
    const id = req.params.id;//obienen el id desde la url
    const producto = ProductoModel.buscarPorId(id);
    
    // primero verificar si existe el producto
    if(!producto){
        return res.status(404).type("html").send(vistaDetalleProducto(null));
    }
    
    // si existe, enviar el detalle (UNA SOLA VEZ)
    return res.type("html").send(vistaDetalleProducto(producto));
};
//controlador: agregar producto
export const agregarProducto = (req, res) => {
    //datos del formulario
    const { nombre, precio, categoria } = req.body; // obtengo de formulario

    // validar datos simples
    if (!nombre || !precio || !categoria) {
        return res.status(400).send('Faltan campos: nombre, precio o categoria');
    }

    const precioNum = parseFloat(precio);
    if (Number.isNaN(precioNum)) {
        return res.status(400).send('Precio inválido');
    }

    // guardar producto
    const nuevoProducto = ProductoModel.agregarProducto(nombre, precioNum, categoria);
    console.log('Producto agregado:', nuevoProducto);
    console.log('Total productos:', ProductoModel.obtenerTodos().length);
    // redirigir o responder
    return res.redirect('/');
}
//Eliminar producto
export const elimanrProducto = (req, res) => {
    const id = req.params.id;//eliminar por id
    const eliminado = ProductoModel.eliminarPorId(id);//llama al modelo para eliminar
    
    if (!eliminado) {
        return res.status(404).send('Producto no encontrado');
    }
    
    console.log('Producto eliminado. ID:', id);
    console.log('Total productos restantes:', ProductoModel.obtenerTodos().length);
    
    // redirigir a la lista después de eliminar
    return res.redirect('/');
}

//Controlador 1: Mostrar formulario de edición
export const mostrarFormularioEdicion = (req, res) => {
    const id = req.params.id;
    const producto = ProductoModel.buscarPorId(id);
    
    if (!producto) {
        return res.status(404).send('Producto no encontrado');
    }
    
    // mostrar formulario con los datos actuales del producto
    return res.type("html").send(vistaFormularioEdicion(producto));
};

//Controlador 2: Procesar cambios de edición
export const procesarEdicion = (req, res) => {
    const id = req.params.id;//obtener id del producto a editar
    const { nombre, precio, categoria } = req.body;//obtiene datos del formulario
    
    // validar datos
    if (!nombre || !precio || !categoria) {
        return res.status(400).send('Faltan campos: nombre, precio o categoria');
    }
    
    const precioNum = parseFloat(precio);
    if (Number.isNaN(precioNum)) {
        return res.status(400).send('Precio inválido');
    }
    
    // actualizar producto
    const actualizado = ProductoModel.actualizarPorId(id, nombre, precioNum, categoria);
    
    if (!actualizado) {
        return res.status(404).send('Producto no encontrado');
    }
    
    console.log('Producto actualizado. ID:', id);
    console.log('Nuevos datos:', { nombre, precio: precioNum, categoria });
    
    // redirigir al detalle del producto editado
    return res.redirect(`/producto/${id}`);
};