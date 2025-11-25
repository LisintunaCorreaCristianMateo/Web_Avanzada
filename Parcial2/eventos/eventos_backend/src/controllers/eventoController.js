import {Evento} from '../models/eventoModel.js';

export const mostrarEventos=async(_req,res)=>{
    try{
        const eventos=await Evento.findAll();
        res.json(eventos);
    }   
    catch(error){
        console.error("Error al listar eventos:", error);
        res.status(500).json({msg:"Error el servidor"})
    }
}

export const crearEvento=async(req,res)=>{
    try{
        const {id,nombre,precio}=req.body;
        const nuevoEvento=await Evento.create({
            id_evento:id,
            nombre:nombre,
            precioPersona:precio
        });
        res.status(201).json(nuevoEvento);
    }
    catch(error){
        console.error("Error al crear evento:", error);
        res.status(500).json({msg:"Error del servidor"})
    }
}