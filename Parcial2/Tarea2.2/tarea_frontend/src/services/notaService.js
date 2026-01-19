import apiClient from './apiService';

// Obtener evaluaciones con filtros
export const obtenerEvaluaciones = async (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  const url = params ? `/evaluaciones?${params}` : '/evaluaciones';
  const response = await apiClient.get(url);
  return response.data.data || response.data;
};

// Crear nueva evaluación
export const crearEvaluacion = async (data) => {
  const response = await apiClient.post('/evaluaciones', data);
  return response.data.data || response.data;
};

// Actualizar evaluación existente
export const actualizarEvaluacion = async (id, data) => {
  const response = await apiClient.put(`/evaluaciones/${id}`, data);
  return response.data.data || response.data;
};

// Eliminar evaluación
export const eliminarEvaluacion = async (id) => {
  const response = await apiClient.delete(`/evaluaciones/${id}`);
  return response.data.data || response.data;
};

// Obtener resumen completo de un estudiante
export const obtenerResumenEstudiante = async (estudianteId) => {
  const response = await apiClient.get(`/evaluaciones/resumen/${estudianteId}`);
  return response.data.data || response.data;
};

// Obtener notas parciales
export const obtenerNotasParciales = async (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  const url = params ? `/evaluaciones/parciales?${params}` : '/evaluaciones/parciales';
  const response = await apiClient.get(url);
  return response.data.data || response.data;
};

// Obtener estados semestrales
export const obtenerEstadosSemestrales = async (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  const url = params ? `/evaluaciones/estados?${params}` : '/evaluaciones/estados';
  const response = await apiClient.get(url);
  return response.data.data || response.data;
};
