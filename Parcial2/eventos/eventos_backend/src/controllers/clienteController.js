import {Cliente} from '../models/clienteModel.js';

export const mostrarClientes=async(_req,res)=>{

try{

    const clientes=await Cliente.findAll();
    res.json(clientes);
}
catch(error){
    console.error("Error al listar clientes:", error);
    res.status(500).json({msg:"Error el servidor"})
}
}
export const crearCliente=async(req,res)=>{
    try{
        const {nombre,cedula}=req.body;
        const nuevoCliente=await Cliente.create({
            nombre:nombre,
            cedula:cedula
        });
        res.status(201).json(nuevoCliente);


    }
    catch(error){
        console.error("Error al crear cliente:", error);
        res.status(500).json({msg:"Error del servidor"})
    }

}