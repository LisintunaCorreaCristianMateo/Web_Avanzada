import { Producto } from "../models/producto.js";
//crear producto

export const crearProducto = async (req, res) => {  
    try {
        const { nombre, stock, precio, categoria } = req.body;
        const nuevoProducto = new Producto({ nombre, stock, precio, categoria });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    }
    catch (error) {
        res.status(500).json({ message: "Error al crear el producto", error: error.message });
    }
};

//listar productos
export const listarProductos = async (_req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: "Error al listar los productos", error: error.message });
    }
};

//obtener producto por id
export const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
};

//actualizar producto
export const actualizarProducto = async (req, res) =>{
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(producto);
}

//eliminar producto
 export const eliminarProducto = async (req, res) => {
    const produ =Producto.findByIdAndUpdate(req.params.id);
       await Producto.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Producto eliminado correctamente"});
};