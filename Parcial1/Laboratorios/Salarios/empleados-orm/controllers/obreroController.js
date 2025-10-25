import {Obrero} from '../models/obrero.js';
//controlador para crear un obrero
export const crearObrero=async(req,res)=>{
    try{
        const {nombre,horasTrabajadas}=req.body;
        if(!nombre || !horasTrabajadas==null){
            return res.status(400).json({message:"Faltan datos"});
        }
        //crear obrero
        const nuevoObrero=await Obrero.create({nombre,horasTrabajadas});
        res.status(201).json(nuevoObrero);
    
    }catch(error){
        console.error("Error al crear obrero:",error);// opcional
        res.status(500).json({message:"Error del servidor"});
    }
};
//listar obreros 
export const listarObreros=async(req,res)=>{
    try{
        const obreros=await Obrero.findAll();
        res.json(obreros);

    
    }catch(error){
        console.error("Error al crear obrero:",error);
        res.status(500).json({message:"Error del servidor"});
    }
};
//Buscar obrero por id
export const obtenerObrero=async(req,res)=>{
    try{
         const obrero = await Obrero.findByPk(req.params.id);  

        if(!obrero){
            return res.status(404).json({message:"Obrero no encontrado"});
        }
        res.json(obrero);
    
    }catch(error){
        console.error("Error al buscar obrero:",error);
        res.status(500).json({message:"Error del servidor"});
    }
};
//Update
export const actualizarObrero = async(req, res) => {
    try {
        const obrero = await Obrero.findByPk(req.params.id);
        if(!obrero){
            return res.status(404).json({mensaje: "Obrero no encontrado"});
        }

        const {nombre, horasTrabajadas} = req.body;

        await obrero.update({nombre, horasTrabajadas});
        res.json(obrero);

    } catch(error){
        res.status(500).json({mensaje: "Error al actualizar el obrero", error: error.message});
    }
};
//Delete
export const eliminarObrero = async (req, res) => {
    try {
        const obrero = await Obrero.findByPk(req.params.id);
        if(!obrero){
            return res.status(404).json({mensaje: "Obrero no encontrado"});
        }
        await obrero.destroy();
        res.json({mensaje: "Obrero eliminado exitosamente"});
    } catch (error) {
        res.status(500).json({mensaje: "Error al eliminar el obrero", error: error.message});
    }
};
// Calcular salario semanal
export const calcularSalarioSemanal = async (req, res) => {
  try {
    const obrero = await Obrero.findByPk(req.params.id);
    if (!obrero) return res.status(404).json({ mensaje: "Obrero no encontrado." });

    const salario = obrero.calcularSalario();
    res.json({
      id: obrero.id,
      nombre: obrero.nombre,
      horasTrabajadas: obrero.horasTrabajadas,
      ...salario
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al calcular el salario.", error: error.message });
  }
};