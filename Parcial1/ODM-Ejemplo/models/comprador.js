import mongoose from "mongoose";

//crear el esquema del documento
const compradorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  edad: { type: Number, required: true }
});

//EXPORT AR EL MODELO
export const Comprador = mongoose.model("Comprador", compradorSchema);