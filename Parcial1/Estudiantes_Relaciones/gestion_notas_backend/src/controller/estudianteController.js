import { Estudiante } from "../models/estudiante.js";

export const crearEstudiante = async (req, res) => {
  try {
    const { nombre, carrera } = req.body;
    const nuevoEstudiante = await Estudiante.create({ nombre, carrera });
    res.status(201).json(nuevoEstudiante);

    if (!nombre || !carrera) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
//obtener estudiantes

export const obtenerEstudiantes= async(req,res)=>{
    try{
        const estudiante=await Estudiante.findAll();
        res.json(estudiante)
    }catch(error){
        console.error("Error al obtener estudiantes",error);
        res.status(500).json({message:"Error del servidor"});
    }
};
//buscar estudiante por id
export const obtenerEstudiante=async(req,res)=>{
    try{
        const estudiante= await Estudiante.findByPk(req.params.id);
        if(!estudiante){
            return res.status(404).json({mesage:"estudiante no encontrado"});
        }
          res.json(estudiante);
        }catch(e){
            res.status(500).json({mesage:"error del servidor"});
        }

    };
export actualizarEstudiante=
