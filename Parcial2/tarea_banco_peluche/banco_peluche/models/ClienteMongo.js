import mongoose from "mongoose";

const ClienteMongoSchema = new mongoose.Schema({
    // Datos personales del cliente
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    dni: {
        type: String,
        required: true,
        trim: true
    },
    edad: {
        type: Number,
        required: true,
        min: 18
    },
    
    // Datos financieros de entrada
    saldoAnterior: Number,
    montoCompras: Number,
    pagoRealizado: Number,

    // Resultados de cálculo 
    saldoBase: Number,
    pagoMinimo: Number,
    esMoroso: Boolean,
    interes: Number,
    multa: Number,
    saldoActual: Number,
    pagoNoIntereses: Number,

    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

const ClienteMongo = mongoose.model("ClienteMongo", ClienteMongoSchema);
export default ClienteMongo;