import {Factura} from '../models/facturaModel.js';

export const mostrarFacturas=async(_req,res)=>{
    try{
        const facturas=await Factura.findAll();
        res.json(facturas);
    }
    catch(error){
        console.error("Error al listar facturas:", error);
        res.status(500).json({msg:"Error el servidor"})
    }
}

export const crearFactura=async(req,res)=>{
    try{
        const {id,clienteId,eventoId,cantidad,total}=req.body;
        const nuevaFactura=await Factura.create({
            id_factura:id,
            clienteId:clienteId,
            eventoId:eventoId,
            Npersonas:cantidad,
            total:total,
            fecha:new Date()
        });
        res.status(201).json(nuevaFactura);
    }
    catch(error){
        console.error("Error al crear factura:", error);
        res.status(500).json({msg:"Error del servidor"})
    }
}