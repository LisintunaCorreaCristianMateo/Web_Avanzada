import { Evaluacion } from '../models/evaluacionModel.js';
import { Estudiante } from '../models/estudianteModel.js';
import { Asignatura } from '../models/asignaturaModel.js';
import { Matricula } from '../models/matriculaModel.js';
import { Op } from 'sequelize';
import * as EvaluacionService from '../services/evaluacionService.js';

/**
 * Obtener todas las evaluaciones con filtros
 */
export const obtenerTodas = async (req, res) => {
  try {
    const { estudiante_id, asignatura_id, parcial, tipo_evaluacion } = req.query;
    
    const filtros = {}; // Temporalmente sin filtro de activo para diagnóstico
    // const filtros = { activo: true }; // Descomentar después del diagnóstico
    
    // Si hay filtro por estudiante o asignatura, buscar matrículas correspondientes
    let matriculaIds = null;
    if (estudiante_id || asignatura_id) {
      const matriculaFiltros = {};
      if (estudiante_id) matriculaFiltros.estudiante_id = estudiante_id;
      if (asignatura_id) matriculaFiltros.asignatura_id = asignatura_id;
      
      const matriculas = await Matricula.findAll({
        where: matriculaFiltros, // Eliminado el filtro de estado: 'activo'
        attributes: ['id']
      });
      
      matriculaIds = matriculas.map(m => m.id);
      if (matriculaIds.length > 0) {
        filtros.matricula_id = { [Op.in]: matriculaIds };
      } else {
        // No hay matrículas, retornar array vacío
        return res.json({
          success: true,
          data: []
        });
      }
    }
    
    if (parcial) filtros.parcial = parcial;
    if (tipo_evaluacion) filtros.tipo_evaluacion = tipo_evaluacion;

    const evaluaciones = await Evaluacion.findAll({
      where: filtros,
      include: [
        {
          model: Matricula,
          as: 'matricula',
          required: false, // Agregar required: false para LEFT JOIN
          include: [
            {
              model: Estudiante,
              as: 'estudiante',
              attributes: ['id', 'nombres', 'apellidos', 'cedula']
            },
            {
              model: Asignatura,
              as: 'asignatura',
              attributes: ['id', 'nombre', 'nrc', 'nivel']
            }
          ]
        }
      ],
      order: [['fecha_evaluacion', 'DESC'], ['parcial', 'ASC']]
    });

    // Transformar datos para mantener compatibilidad con frontend
    const evaluacionesTransformadas = evaluaciones.map(ev => ({
      id: ev.id,
      matricula_id: ev.matricula_id,
      estudiante_id: ev.matricula?.estudiante?.id,
      asignatura_id: ev.matricula?.asignatura?.id,
      estudiante: ev.matricula?.estudiante,
      asignatura: ev.matricula?.asignatura,
      parcial: ev.parcial,
      tipo_evaluacion: ev.tipo_evaluacion,
      nota: ev.nota,
      porcentaje: ev.porcentaje,
      nota_ponderada: ev.nota_ponderada,
      fecha_evaluacion: ev.fecha_evaluacion,
      observaciones: ev.observaciones,
      activo: ev.activo,
      created_at: ev.created_at,
      updated_at: ev.updated_at
    }));

    res.json({
      success: true,
      data: evaluacionesTransformadas
    });
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener evaluaciones',
      error: error.message
    });
  }
};

/**
 * Obtener evaluación por ID
 */
export const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const evaluacion = await Evaluacion.findOne({
      where: { id, activo: true },
      include: [
        {
          model: Estudiante,
          as: 'estudiante',
          attributes: ['id', 'nombres', 'apellidos', 'cedula']
        },
        {
          model: Asignatura,
          as: 'asignatura',
          attributes: ['id', 'nombre', 'nrc', 'nivel']
        }
      ]
    });

    if (!evaluacion) {
      return res.status(404).json({
        success: false,
        message: 'Evaluación no encontrada'
      });
    }

    res.json({
      success: true,
      data: evaluacion
    });
  } catch (error) {
    console.error('Error al obtener evaluación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener evaluación',
      error: error.message
    });
  }
};

/**
 * Crear nueva evaluación
 */
export const crear = async (req, res) => {
  try {
    const {
      estudiante_id,
      asignatura_id,
      parcial,
      tipo_evaluacion,
      nota,
      porcentaje,
      fecha_evaluacion,
      observaciones
    } = req.body;

    // Validaciones
    if (!estudiante_id || !asignatura_id || !parcial || !tipo_evaluacion || nota === undefined || porcentaje === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios deben estar presentes'
      });
    }

    // Validar que el parcial esté entre 1 y 3
    if (parcial < 1 || parcial > 3) {
      return res.status(400).json({
        success: false,
        message: 'El parcial debe estar entre 1 y 3'
      });
    }

    // Validar que la nota esté entre 0 y 20
    if (nota < 0 || nota > 20) {
      return res.status(400).json({
        success: false,
        message: 'La nota debe estar entre 0 y 20'
      });
    }

    // Validar que el porcentaje esté entre 0 y 100
    if (porcentaje < 0 || porcentaje > 100) {
      return res.status(400).json({
        success: false,
        message: 'El porcentaje debe estar entre 0 y 100'
      });
    }

    // Buscar la matrícula correspondiente (si existe)
    const matricula = await Matricula.findOne({
      where: {
        estudiante_id,
        asignatura_id
      }
    });

    if (!matricula) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró una matrícula activa para este estudiante en esta asignatura'
      });
    }

    // Verificar la suma de porcentajes para el parcial no exceda 100%
    const evaluacionesExistentes = await Evaluacion.findAll({
      where: {
        matricula_id: matricula.id,
        parcial,
        activo: true
      }
    });

    const sumaPorcentajes = evaluacionesExistentes.reduce((sum, ev) => sum + parseFloat(ev.porcentaje), 0);
    
    if (sumaPorcentajes + parseFloat(porcentaje) > 100) {
      return res.status(400).json({
        success: false,
        message: `La suma de porcentajes para el parcial ${parcial} excede el 100%. Disponible: ${100 - sumaPorcentajes}%`
      });
    }

    // Crear evaluación
    const evaluacion = await Evaluacion.create({
      matricula_id: matricula.id,
      parcial,
      tipo_evaluacion,
      nota,
      porcentaje,
      fecha_evaluacion: fecha_evaluacion || new Date(),
      observaciones
    });

    // Obtener evaluación completa con relaciones
    const evaluacionCompleta = await Evaluacion.findOne({
      where: { id: evaluacion.id },
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [
            {
              model: Estudiante,
              as: 'estudiante',
              attributes: ['id', 'nombres', 'apellidos', 'cedula']
            },
            {
              model: Asignatura,
              as: 'asignatura',
              attributes: ['id', 'nombre', 'nrc', 'nivel']
            }
          ]
        }
      ]
    });

    // Transformar para compatibilidad
    const evaluacionTransformada = {
      id: evaluacionCompleta.id,
      matricula_id: evaluacionCompleta.matricula_id,
      estudiante_id: evaluacionCompleta.matricula?.estudiante?.id,
      asignatura_id: evaluacionCompleta.matricula?.asignatura?.id,
      estudiante: evaluacionCompleta.matricula?.estudiante,
      asignatura: evaluacionCompleta.matricula?.asignatura,
      parcial: evaluacionCompleta.parcial,
      tipo_evaluacion: evaluacionCompleta.tipo_evaluacion,
      nota: evaluacionCompleta.nota,
      porcentaje: evaluacionCompleta.porcentaje,
      nota_ponderada: evaluacionCompleta.nota_ponderada,
      fecha_evaluacion: evaluacionCompleta.fecha_evaluacion,
      observaciones: evaluacionCompleta.observaciones,
      activo: evaluacionCompleta.activo
    };

    res.status(201).json({
      success: true,
      message: 'Evaluación creada exitosamente',
      data: evaluacionTransformada
    });
  } catch (error) {
    console.error('Error al crear evaluación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear evaluación',
      error: error.message
    });
  }
};

/**
 * Actualizar evaluación
 */
export const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nota,
      porcentaje,
      tipo_evaluacion,
      fecha_evaluacion,
      observaciones
    } = req.body;

    const evaluacion = await Evaluacion.findOne({
      where: { id, activo: true }
    });

    if (!evaluacion) {
      return res.status(404).json({
        success: false,
        message: 'Evaluación no encontrada'
      });
    }

    // Validaciones
    if (nota !== undefined && (nota < 0 || nota > 20)) {
      return res.status(400).json({
        success: false,
        message: 'La nota debe estar entre 0 y 20'
      });
    }

    if (porcentaje !== undefined) {
      // Verificar suma de porcentajes
      const evaluacionesExistentes = await Evaluacion.findAll({
        where: {
          matricula_id: evaluacion.matricula_id,
          parcial: evaluacion.parcial,
          activo: true,
          id: { [Op.ne]: id }
        }
      });

      const sumaPorcentajes = evaluacionesExistentes.reduce((sum, ev) => sum + parseFloat(ev.porcentaje), 0);
      
      if (sumaPorcentajes + parseFloat(porcentaje) > 100) {
        return res.status(400).json({
          success: false,
          message: `La suma de porcentajes excede el 100%. Disponible: ${100 - sumaPorcentajes}%`
        });
      }
    }

    // Actualizar campos
    if (nota !== undefined) evaluacion.nota = nota;
    if (porcentaje !== undefined) evaluacion.porcentaje = porcentaje;
    if (tipo_evaluacion) evaluacion.tipo_evaluacion = tipo_evaluacion;
    if (fecha_evaluacion) evaluacion.fecha_evaluacion = fecha_evaluacion;
    if (observaciones !== undefined) evaluacion.observaciones = observaciones;

    await evaluacion.save();

    // Obtener evaluación completa con relaciones
    const evaluacionCompleta = await Evaluacion.findOne({
      where: { id },
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [
            {
              model: Estudiante,
              as: 'estudiante',
              attributes: ['id', 'nombres', 'apellidos', 'cedula']
            },
            {
              model: Asignatura,
              as: 'asignatura',
              attributes: ['id', 'nombre', 'nrc', 'nivel']
            }
          ]
        }
      ]
    });

    // Transformar para compatibilidad
    const evaluacionTransformada = {
      id: evaluacionCompleta.id,
      matricula_id: evaluacionCompleta.matricula_id,
      estudiante_id: evaluacionCompleta.matricula?.estudiante?.id,
      asignatura_id: evaluacionCompleta.matricula?.asignatura?.id,
      estudiante: evaluacionCompleta.matricula?.estudiante,
      asignatura: evaluacionCompleta.matricula?.asignatura,
      parcial: evaluacionCompleta.parcial,
      tipo_evaluacion: evaluacionCompleta.tipo_evaluacion,
      nota: evaluacionCompleta.nota,
      porcentaje: evaluacionCompleta.porcentaje,
      nota_ponderada: evaluacionCompleta.nota_ponderada,
      fecha_evaluacion: evaluacionCompleta.fecha_evaluacion,
      observaciones: evaluacionCompleta.observaciones,
      activo: evaluacionCompleta.activo
    };

    res.json({
      success: true,
      message: 'Evaluación actualizada exitosamente',
      data: evaluacionTransformada
    });
  } catch (error) {
    console.error('Error al actualizar evaluación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar evaluación',
      error: error.message
    });
  }
};

/**
 * Eliminar evaluación (soft delete)
 */
export const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Evaluacion.destroy({
      where: { id }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Evaluación no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Evaluación eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar evaluación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar evaluación',
      error: error.message
    });
  }
};

/**
 * Calcular resumen de notas por parcial para un estudiante en una asignatura
 */
export const calcularResumenParcial = async (req, res) => {
  try {
    const { estudiante_id, asignatura_id, parcial } = req.params;
    
    const data = await EvaluacionService.calcularResumenParcial(estudiante_id, asignatura_id, parcial);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error al calcular resumen del parcial:', error);
    res.status(500).json({
      success: false,
      message: 'Error al calcular resumen del parcial',
      error: error.message
    });
  }
};

/**
 * Calcular estado semestral completo (3 parciales)
 * Cada parcial vale 14 puntos
 * Total semestre: 42 puntos
 * Si P1 + P2 < 28 puntos → PIERDE automáticamente
 */
export const calcularEstadoSemestral = async (req, res) => {
  try {
    const { estudiante_id, asignatura_id } = req.params;

    const data = await EvaluacionService.calcularEstadoSemestral(estudiante_id, asignatura_id);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error al calcular estado semestral:', error);
    
    if (error.message === 'Estudiante o asignatura no encontrados') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al calcular estado semestral',
      error: error.message
    });
  }
};

/**
 * Obtener resumen de parciales para todos los estudiantes/asignaturas
 */
export const obtenerResumenesParciales = async (req, res) => {
  try {
    const { estudiante_id, asignatura_id } = req.query;
    
    // Obtener todas las matrículas (ya no existe campo 'estado')
    const matriculaFiltros = {};
    if (estudiante_id) matriculaFiltros.estudiante_id = estudiante_id;
    if (asignatura_id) matriculaFiltros.asignatura_id = asignatura_id;
    
    const matriculas = await Matricula.findAll({
      where: matriculaFiltros,
      include: [
        { model: Estudiante, as: 'estudiante' },
        { model: Asignatura, as: 'asignatura' }
      ]
    });
    
    const resumenes = [];
    
    for (const matricula of matriculas) {
      // Calcular totales por parcial
      for (let parcial = 1; parcial <= 3; parcial++) {
        const evaluaciones = await Evaluacion.findAll({
          where: {
            matricula_id: matricula.id,
            parcial,
            activo: true
          }
        });
        
        const total = evaluaciones.reduce((sum, ev) => sum + parseFloat(ev.nota_ponderada || 0), 0);
        
        resumenes.push({
          estudiante_id: matricula.estudiante_id,
          asignatura_id: matricula.asignatura_id,
          estudiante: matricula.estudiante,
          asignatura: matricula.asignatura,
          parcial,
          total: parseFloat(total.toFixed(2))
        });
      }
    }
    
    res.json({
      success: true,
      data: resumenes
    });
  } catch (error) {
    console.error('Error al obtener resúmenes parciales:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener resúmenes parciales',
      error: error.message
    });
  }
};

/**
 * Obtener estados semestrales para todos los estudiantes/asignaturas
 */
export const obtenerEstadosSemestrales = async (req, res) => {
  try {
    const { estudiante_id, asignatura_id } = req.query;
    
    // Obtener todas las matrículas (ya no existe campo 'estado')
    const matriculaFiltros = {};
    if (estudiante_id) matriculaFiltros.estudiante_id = estudiante_id;
    if (asignatura_id) matriculaFiltros.asignatura_id = asignatura_id;
    
    const matriculas = await Matricula.findAll({
      where: matriculaFiltros,
      include: [
        { model: Estudiante, as: 'estudiante' },
        { model: Asignatura, as: 'asignatura' }
      ]
    });
    
    const estados = [];
    
    for (const matricula of matriculas) {
      // Calcular totales por parcial
      const totales = {};
      for (let parcial = 1; parcial <= 3; parcial++) {
        const evaluaciones = await Evaluacion.findAll({
          where: {
            matricula_id: matricula.id,
            parcial,
            activo: true
          }
        });
        
        totales[`p${parcial}`] = evaluaciones.reduce((sum, ev) => sum + parseFloat(ev.nota_ponderada || 0), 0);
      }
      
      const p1 = totales.p1 || 0;
      const p2 = totales.p2 || 0;
      const p3 = totales.p3 || 0;
      const promedio = ((p1 + p2 + p3) / 3);
      
      let estado = 'Reprobado semestre';
      if (p1 + p2 < 28) {
        estado = 'Reprobado anticipado';
      } else if (promedio >= 14) {
        estado = 'Aprobado semestre';
      }
      
      estados.push({
        estudiante_id: matricula.estudiante_id,
        asignatura_id: matricula.asignatura_id,
        estudiante: matricula.estudiante,
        asignatura: matricula.asignatura,
        p1: parseFloat(p1.toFixed(2)),
        p2: parseFloat(p2.toFixed(2)),
        p3: parseFloat(p3.toFixed(2)),
        promedio: parseFloat(promedio.toFixed(2)),
        estado
      });
    }
    
    res.json({
      success: true,
      data: estados
    });
  } catch (error) {
    console.error('Error al obtener estados semestrales:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estados semestrales',
      error: error.message
    });
  }
};
