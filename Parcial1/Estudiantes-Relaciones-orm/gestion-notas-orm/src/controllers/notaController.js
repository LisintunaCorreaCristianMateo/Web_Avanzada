import {Nota } from "../models/nota.js";
import {Estudiante } from "../models/estudiante.js";

//procesos-funciones
function enRango(nota){
    //comprobar si una nota esta en el rango 0-20
    if (typeof nota === "number" || nota < 0 || nota > 20) {
        return true;
    }else{
        return false;
    }
}

//calcular el promedio 
function calcularPromedio(nota1, nota2, nota3){
    const suma = nota1 + nota2 + nota3;
    const promedio = suma / 3;
    return parseFloat(promedio.toFixed(2));
}

//determinar categoria
function determinarCategoria(promedio){
    if(promedio >= 18){
        return "Excelente";
    }else if(promedio >= 14){
        return "Aprobado";
    }else if(promedio <14){
        return "Reprobado";
    }
}

//crear una nueva nota
export const crearNota = async (req, res) => {
    try {
        const{estudianteId, asignatura, nota1, nota2, nota3} = req.body;
        if(!estudianteId || !asignatura || [nota1, nota2, nota3].some((n) => n === undefined)){
            return res.status(400).json({message: "Datos obligatorios"});

            
        }
        if(![nota1, nota2, nota3].every(enRango)){// every devuelve true si todos cumplen la condicion
            return res.status(400).json({message: "Las notas deben estar en el rango 0-20"});
        }
        //llamar a las funciones para calcular promedio y categoria
        const promedio = calcularPromedio(nota1, nota2, nota3);
        const categoria = determinarCategoria(promedio);
        const nuevaNota = await Nota.create({
            estudianteId,
            asignatura,
            nota1,
            nota2,
            nota3,
            promedio,
            categoria
        });
        res.status(201).json(nuevaNota);

    }catch (e) {
        res.status(500).json({error: e.message});
    }
}

//obtener todas las notas
export const obtenerNotas = async (_req, res) => {
    try {
        const notas = await Nota.findAll();
        res.status(200).json(notas);
    }   catch (e) {
        res.status(500).json({message: "Error al obtener Estudiantes",error: e.message});
    }
};

//obtener una nota por id
export const obtenerNotaPorId = async (req, res) => {
    try{
        const notas = await Nota.findByPk(req.params.id, {
            attributes: ['id', 'asignatura', 'promedio', 'categoria'], // Solo campos específicos de Nota
            include: {
                model: Estudiante,
                attributes: ['id', 'nombre', 'carrera'] // Solo campos específicos del Estudiante
            }
        });
        if(!notas){
            return res.status(404).json({message: "Nota no encontrada, verifique el ID"});
        }
        res.json(notas);

    }catch (e) {
        res.status(500).json({message: "Error al buscar Nota",error: e.message});
    }
}

//actualizar una nota
export const actualizarNota = async (req, res) => {
  try {
    const nota = await Nota.findByPk(req.params.id);
    if (!nota) return res.status(404).json({ mensaje: "No existe" });

    // Permitir actualizar cualquier campo; si vienen las 3 notas, recalculamos.
    const { nota1, nota2, nota3 } = req.body;
    let payload = { ...req.body };//copiamos todo el body o notas a payload

    if ([nota1, nota2, nota3].every((n) => n !== undefined)) {
      if (![nota1, nota2, nota3].every(enRango)) {
        return res.status(400).json({ mensaje: "Las notas deben estar entre 0 y 20." });
      }
      const promedio = calcularPromedio(nota1, nota2, nota3);
      const categoria = categoriaPorPromedio(promedio);
      payload.promedio = promedio;
      payload.categoria = categoria;
    }

    await nota.update(payload);
    res.json(nota);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//eliminar una nota
export const eliminarNota = async (req, res) => {
    try {
        const nota = await Nota.findByPk(req.params.id);
        if(!nota){
            return res.status(404).json({message: "Nota no encontrada"});
        }
        await nota.destroy();
        res.json({message: "Nota eliminada correctamente"});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
};