import { Asignatura, Docente } from '../models/index.js';
import { Op } from 'sequelize';

// Obtener todas las asignaturas
export const obtenerAsignaturas = async (req, res) => {
  try {
    const asignaturas = await Asignatura.findAll({
      include: [
        {
          model: Docente,
          as: 'docente',
          attributes: ['id', 'nombres', 'apellidos', 'especialidad']
        }
      ],
      order: [['nombre', 'ASC']]
    });
    res.json(asignaturas);
  } catch (error) {
    console.error('Error al obtener asignaturas:', error);
    res.status(500).json({ error: 'Error al obtener asignaturas' });
  }
};

// Obtener una asignatura por ID
export const obtenerAsignaturaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const asignatura = await Asignatura.findByPk(id);
    
    if (!asignatura) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    
    res.json(asignatura);
  } catch (error) {
    console.error('Error al obtener asignatura:', error);
    res.status(500).json({ error: 'Error al obtener asignatura' });
  }
};

// Buscar asignaturas
export const buscarAsignaturas = async (req, res) => {
  try {
    const { termino } = req.query;
    const asignaturas = await Asignatura.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${termino}%` } },
          { nrc: { [Op.like]: `%${termino}%` } }
        ]
      },
      include: [
        {
          model: Docente,
          as: 'docente',
          attributes: ['id', 'nombres', 'apellidos', 'especialidad']
        }
      ],
      order: [['nombre', 'ASC']]
    });
    res.json(asignaturas);
  } catch (error) {
    console.error('Error al buscar asignaturas:', error);
    res.status(500).json({ error: 'Error al buscar asignaturas' });
  }
};

// Crear asignatura
export const crearAsignatura = async (req, res) => {
  try {
    const { nombre, nrc, descripcion, creditos, nivel, docente_id } = req.body;
    
    const asignatura = await Asignatura.create({
      nombre,
      nrc,
      descripcion,
      creditos,
      nivel,
      docente_id: docente_id || null
    });
    
    res.status(201).json(asignatura);
  } catch (error) {
    console.error('Error al crear asignatura:', error);
    res.status(500).json({ error: 'Error al crear asignatura' });
  }
};

// Actualizar asignatura
export const actualizarAsignatura = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, nrc, descripcion, creditos, nivel, docente_id } = req.body;
    
    const asignatura = await Asignatura.findByPk(id);
    if (!asignatura) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    
    await asignatura.update({
      nombre: nombre || asignatura.nombre,
      nrc: nrc || asignatura.nrc,
      descripcion: descripcion || asignatura.descripcion,
      creditos: creditos || asignatura.creditos,
      nivel: nivel !== undefined ? nivel : asignatura.nivel,
      docente_id: docente_id !== undefined ? (docente_id || null) : asignatura.docente_id
    });
    
    res.json(asignatura);
  } catch (error) {
    console.error('Error al actualizar asignatura:', error);
    res.status(500).json({ error: 'Error al actualizar asignatura' });
  }
};

// Eliminar asignatura
export const eliminarAsignatura = async (req, res) => {
  try {
    const { id } = req.params;
    const asignatura = await Asignatura.findByPk(id);
    
    if (!asignatura) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    
    await asignatura.destroy();
    res.json({ mensaje: 'Asignatura eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar asignatura:', error);
    res.status(500).json({ error: 'Error al eliminar asignatura' });
  }
};
