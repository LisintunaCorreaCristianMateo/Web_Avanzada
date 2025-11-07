import { Estudiante } from "../models/estudiante.js";
export const crearEstudiante = async (req, res) => {
    try {
        const { nombre, carrera } = req.body;
        if(!nombre || !carrera){
            return  res.status(400).json({message: "Faltan datos obligatorios"});
        }

        const nuevo = await Estudiante.create({nombre, carrera});
        res.status(201).json(nuevo);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
};
// obtener todos los estudiantes
export const obtenerEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.findAll();
        res.status(200).json(estudiantes);
    }   catch (e) {
        res.status(500).json({message: "Error al obtener Estudiantes",error: e.message});
    }

};
// obtener un estudiante por id
export const obtenerEstudiantePorId = async (req, res) => {
    try {
        const estudiante = await Estudiante.findByPk(req.params.id);   
        if(!estudiante){
            return res.status(404).json({message: "Estudiante no encontrado, verifique el ID"});
        }
        res.json(estudiante);

    }catch (e) {
        res.status(500).json({message: "Error al buscar Estudiante",error: e.message});
    }
};
// actualizar un estudiante
export const actualizarEstudiante = async (req, res) => {
    try {
        const estudiante = await Estudiante.findByPk(req.params.id);
        if(!estudiante){
            return res.status(404).json({message: "Estudiante no encontrado"});
        }
        const { nombre, carrera } = req.body;
        await estudiante.update({nombre, carrera});
        res.json(estudiante);
        if(!nombre || !carrera){
            return  res.status(400).json({message: "Ingrese todos los datos obligatorios"});
        }
    } catch (e) {
        res.status(500).json({error: e.message});
    }
};
// eliminar un estudiante
export const eliminarEstudiante = async (req, res) => {
    try {
        const estudiante = await Estudiante.findByPk(req.params.id);
        if(!estudiante){
            return res.status(404).json({message: "Estudiante no encontrado"});
        }
        await estudiante.destroy();
        res.status(204).send();

    }catch (e) {
        res.status(500).json({message: "Error al eliminar Estudiante",error: e.message});
    }
};
