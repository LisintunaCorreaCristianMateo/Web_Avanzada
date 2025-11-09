import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const pedidoSchema = new Schema({
    cliente: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    productos: [{
        productoId: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
        cantidad: { type: Number, required: true }
    }],
    total: { type: Number, required: true }
}, 
{ timestamps: true }
);

export const Pedido = model('Pedido', pedidoSchema);