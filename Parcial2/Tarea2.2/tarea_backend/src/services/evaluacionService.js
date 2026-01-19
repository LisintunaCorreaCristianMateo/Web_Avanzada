import { Evaluacion } from '../models/evaluacionModel.js';
import { Estudiante } from '../models/estudianteModel.js';
import { Asignatura } from '../models/asignaturaModel.js';

/**
 * Calcular resumen de notas por parcial para un estudiante en una asignatura
 */
export const calcularResumenParcial = async (estudiante_id, asignatura_id, parcial) => {
  const evaluaciones = await Evaluacion.findAll({
    where: {
      estudiante_id,
      asignatura_id,
      parcial,
      activo: true
    }
  });

  if (evaluaciones.length === 0) {
    return {
      parcial: parseInt(parcial),
      evaluaciones: [],
      nota_parcial: 0,
      sobre: 14,
      porcentaje_completado: 0
    };
  }

  // Calcular nota del parcial (suma de notas ponderadas)
  const notaParcial = evaluaciones.reduce((sum, ev) => {
    const notaPonderada = (ev.nota * ev.porcentaje) / 100;
    return sum + notaPonderada;
  }, 0);

  // Calcular porcentaje completado (suma de porcentajes)
  const porcentajeCompletado = evaluaciones.reduce((sum, ev) => sum + parseFloat(ev.porcentaje), 0);

  // Proyectar nota sobre 14 puntos
  const notaSobre14 = (notaParcial * 14) / 20;

  return {
    parcial: parseInt(parcial),
    evaluaciones: evaluaciones.map(ev => ({
      id: ev.id,
      tipo_evaluacion: ev.tipo_evaluacion,
      nota: ev.nota,
      porcentaje: ev.porcentaje,
      nota_ponderada: ev.nota_ponderada,
      fecha_evaluacion: ev.fecha_evaluacion
    })),
    nota_parcial: parseFloat(notaParcial.toFixed(2)),
    nota_sobre_14: parseFloat(notaSobre14.toFixed(2)),
    sobre: 14,
    porcentaje_completado: parseFloat(porcentajeCompletado.toFixed(2))
  };
};

/**
 * Calcular estado semestral completo (3 parciales)
 * Cada parcial vale 14 puntos
 * Total semestre: 42 puntos
 * Si P1 + P2 < 28 puntos → PIERDE automáticamente
 */
export const calcularEstadoSemestral = async (estudiante_id, asignatura_id) => {
  const estudiante = await Estudiante.findByPk(estudiante_id);
  const asignatura = await Asignatura.findByPk(asignatura_id);

  if (!estudiante || !asignatura) {
    throw new Error('Estudiante o asignatura no encontrados');
  }

  // Calcular cada parcial
  const parciales = [];
  let sumaTotal = 0;

  for (let numeroParcial = 1; numeroParcial <= 3; numeroParcial++) {
    const evaluaciones = await Evaluacion.findAll({
      where: {
        estudiante_id,
        asignatura_id,
        parcial: numeroParcial,
        activo: true
      }
    });

    // Calcular nota del parcial
    const notaParcial = evaluaciones.reduce((sum, ev) => {
      const notaPonderada = (ev.nota * ev.porcentaje) / 100;
      return sum + notaPonderada;
    }, 0);

    // Proyectar sobre 14 puntos
    const notaSobre14 = (notaParcial * 14) / 20;
    sumaTotal += notaSobre14;

    const porcentajeCompletado = evaluaciones.reduce((sum, ev) => sum + parseFloat(ev.porcentaje), 0);

    parciales.push({
      numero: numeroParcial,
      evaluaciones: evaluaciones.length,
      nota_sobre_20: parseFloat(notaParcial.toFixed(2)),
      nota_sobre_14: parseFloat(notaSobre14.toFixed(2)),
      porcentaje_completado: parseFloat(porcentajeCompletado.toFixed(2))
    });
  }

  // Calcular estado
  const sumaParcial1y2 = parciales[0].nota_sobre_14 + parciales[1].nota_sobre_14;
  let estado = 'EN_PROGRESO';
  let mensaje = 'Semestre en progreso';

  // Regla: Si P1 + P2 < 28, pierde automáticamente
  if (parciales[1].porcentaje_completado === 100) { // Solo si el parcial 2 está completo
    if (sumaParcial1y2 < 28) {
      estado = 'REPROBADO';
      mensaje = `Reprobado automáticamente. Suma P1 + P2 = ${sumaParcial1y2.toFixed(2)} < 28 puntos`;
    }
  }

  // Si tiene los 3 parciales completos, verificar aprobación final
  if (parciales.every(p => p.porcentaje_completado === 100)) {
    if (estado !== 'REPROBADO') {
      // Nota mínima para aprobar: 28/42 = 66.67% del semestre
      if (sumaTotal >= 28) {
        estado = 'APROBADO';
        mensaje = `Aprobado con ${sumaTotal.toFixed(2)}/42 puntos`;
      } else {
        estado = 'REPROBADO';
        mensaje = `Reprobado con ${sumaTotal.toFixed(2)}/42 puntos (mínimo 28)`;
      }
    }
  }

  return {
    estudiante: {
      id: estudiante.id,
      nombres: estudiante.nombres,
      apellidos: estudiante.apellidos,
      cedula: estudiante.cedula
    },
    asignatura: {
      id: asignatura.id,
      nombre: asignatura.nombre,
      nrc: asignatura.nrc,
      nivel: asignatura.nivel
    },
    parciales,
    resumen: {
      suma_parcial_1_y_2: parseFloat(sumaParcial1y2.toFixed(2)),
      suma_total: parseFloat(sumaTotal.toFixed(2)),
      sobre: 42,
      promedio_porcentaje: parseFloat(((sumaTotal / 42) * 100).toFixed(2)),
      estado,
      mensaje
    }
  };
};

export default {
  calcularResumenParcial,
  calcularEstadoSemestral
};
