import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const participantSchema = new Schema({
    Nombre: { type: String, required: true },
    // almacenamos el amigo asignado como objeto { id, Nombre } o null
    amigoSecreto: { type: Schema.Types.Mixed, default: null },
    // restricciones: array de ObjectId de otros participantes (puede estar vacío)
    restrictions: [{ type: Schema.Types.ObjectId, default: [] }]
}, { _id: true });

const eventSchema = new Schema({
    titulo: { type: String, required: true },
    fecha: { type: Date, required: true },
    participantes: [participantSchema],
    assigned: { type: Boolean, default: false }
}, { timestamps: true });

export const Event = model('Event', eventSchema);
