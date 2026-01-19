import { Matricula, Estudiante, Asignatura } from '../models/index.js';

export const crearMatricula = async (req, res) => {
  try {
    const { estudiante_id, asignatura_id } = req.body;
    
    // Verificar si ya existe la matrícula
    const matriculaExistente = await Matricula.findOne({
      where: {
        estudiante_id,
        asignatura_id
      }
    });

    if (matriculaExistente) {
      return res.status(400).json({ mensaje: 'El estudiante ya está matriculado en esta asignatura' });
    }

    const nuevaMatricula = await Matricula.create({
      estudiante_id,
      asignatura_id,
      fecha_matricula: new Date()
    });

    res.status(201).json(nuevaMatricula);
  } catch (error) {
    console.error('Error al crear matrícula:', error);
    res.status(500).json({ mensaje: 'Error al crear matrícula', error: error.message });
  }
};

export const obtenerMatriculasPorEstudiante = async (req, res) => {
  try {
    const { estudianteId } = req.params;
    
    const matriculas = await Matricula.findAll({
      where: { estudiante_id: estudianteId },
      include: [
        {
          model: Asignatura,
          as: 'asignatura',
          attributes: ['id', 'nombre', 'nrc', 'creditos', 'nivel', 'descripcion']
        }
      ],
      order: [['fecha_matricula', 'DESC']]
    });

    res.json(matriculas);
  } catch (error) {
    console.error('Error al obtener matrículas:', error);
    res.status(500).json({ mensaje: 'Error al obtener matrículas', error: error.message });
  }
};

export const obtenerTodasMatriculas = async (req, res) => {
  try {
    const matriculas = await Matricula.findAll({
      include: [
        {
          model: Estudiante,
          as: 'estudiante',
          attributes: ['id', 'nombres', 'apellidos', 'cedula']
        },
        {
          model: Asignatura,
          as: 'asignatura',
          attributes: ['id', 'nombre', 'nrc', 'creditos', 'nivel', 'descripcion']
        }
      ],
      order: [['fecha_matricula', 'DESC']]
    });

    res.json(matriculas);
  } catch (error) {
    console.error('Error al obtener matrículas:', error);
    res.status(500).json({ mensaje: 'Error al obtener matrículas', error: error.message });
  }
};

export const eliminarMatricula = async (req, res) => {
  try {
    const { id } = req.params;
    
    const matricula = await Matricula.findByPk(id);
    
    if (!matricula) {
      return res.status(404).json({ mensaje: 'Matrícula no encontrada' });
    }

    // Borrado físico definitivo
    await matricula.destroy();
    res.json({ mensaje: 'Matrícula eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar matrícula:', error);
    res.status(500).json({ mensaje: 'Error al eliminar matrícula', error: error.message });
  }
};
// Nota: la API ya no expone actualización de 'estado' de matrícula.
// Para marcar que una matrícula ya no existe, se debe eliminar con DELETE.
