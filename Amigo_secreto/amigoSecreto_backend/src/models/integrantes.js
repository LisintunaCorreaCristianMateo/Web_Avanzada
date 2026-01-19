import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const integranteSchema = new Schema({
    Nombre: { type: String, required: true },
    // estado ahora es boolean: true/false
    estado: { type: Boolean, required: true, default: false },
    // amigoSecreto puede ser un objeto (id + Nombre) o null si aún no está asignado
    amigoSecreto: { type: Schema.Types.Mixed, default: null },
    // campo opcional adicional
    total: { type: Number }
},
{ timestamps: true }
);

export const Integrante = model('Integrante', integranteSchema);