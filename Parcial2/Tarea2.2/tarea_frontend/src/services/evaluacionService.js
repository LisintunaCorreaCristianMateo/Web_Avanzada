import apiClient from './apiClient';

/**
 * Servicio para gestionar evaluaciones (notas)
 */

/**
 * Obtener todas las evaluaciones con filtros opcionales
 */
export const obtenerEvaluaciones = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.estudiante_id) params.append('estudiante_id', filtros.estudiante_id);
    if (filtros.asignatura_id) params.append('asignatura_id', filtros.asignatura_id);
    if (filtros.parcial) params.append('parcial', filtros.parcial);
    if (filtros.tipo_evaluacion) params.append('tipo_evaluacion', filtros.tipo_evaluacion);

    const response = await apiClient.get(`/evaluaciones?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Obtener evaluación por ID
 */
export const obtenerEvaluacionPorId = async (id) => {
  try {
    const response = await apiClient.get(`/evaluaciones/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Crear nueva evaluación
 */
export const crearEvaluacion = async (datos) => {
  try {
    const response = await apiClient.post('/evaluaciones', datos);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Actualizar evaluación existente
 */
export const actualizarEvaluacion = async (id, datos) => {
  try {
    const response = await apiClient.put(`/evaluaciones/${id}`, datos);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Eliminar evaluación
 */
export const eliminarEvaluacion = async (id) => {
  try {
    const response = await apiClient.delete(`/evaluaciones/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Calcular resumen de un parcial específico
 */
export const calcularResumenParcial = async (estudiante_id, asignatura_id, parcial) => {
  try {
    const response = await apiClient.get(
      `/evaluaciones/resumen-parcial/${estudiante_id}/${asignatura_id}/${parcial}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Calcular estado semestral completo (3 parciales)
 */
export const calcularEstadoSemestral = async (estudiante_id, asignatura_id) => {
  try {
    const response = await apiClient.get(
      `/evaluaciones/estado-semestral/${estudiante_id}/${asignatura_id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

