import { Pedido } from "../models/pedido.js";
import { Producto } from "../models/producto.js";

const calcularTotal = async (items) => {
    const ids = items.map(i => i.productoId);
    const productos = await Producto.find({ _id: { $in: ids } });
    
    let total = 0;
    for (const item of items) {
        const producto = productos.find(p => p._id.toString() === item.productoId);
        if (producto) {
            total += producto.precio * item.cantidad;
        }
    }
    return total;
};

export const crearPedido = async (req, res) => {
    try {
        const { cliente } = req.body;
        const items = req.body.items ?? req.body.productos;

        if (!cliente || !items || items.length === 0) {
            return res.status(400).json({ message: "cliente y productos son obligatorios" });
        }

        const total = await calcularTotal(items);
        const nuevoPedido = new Pedido({ cliente, productos: items, total });
        await nuevoPedido.save();

        res.status(201).json(nuevoPedido);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el pedido", error: error.message });
    }
};

export const listarPedidos = async (_req, res) => {
    try {
        const pedidos = await Pedido.find();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: "Error al listar los pedidos", error: error.message });
    }
};