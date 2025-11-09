//crear una funcion  crear pedido en crear pedidoController.js similar a la de crear productoController.js pero para el modelo pedido.js
import { Pedido } from "../models/pedido.js";
 const cancularTotal = (items) => {
    return items.reduce((total, item) => total + item.precio * item.cantidad, 0);
};


export const crearPedido = async (req, res) => {

    try {
        const { cliente, items } = req.body;
        const total = cancularTotal(items);
        const nuevoPedido = new Pedido({ cliente, productos: items, total });
        await nuevoPedido.save();
        res.status(201).json(nuevoPedido);
    }   catch (error) { 
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