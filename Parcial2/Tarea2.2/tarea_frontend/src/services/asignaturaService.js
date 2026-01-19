import apiClient from './apiService';

export const obtenerAsignaturas = async () => {
  try {
    const response = await apiClient.get('/asignaturas');
    return response.data;
  } catch (error) {
    console.error('Error en obtenerAsignaturas:', error);
    throw error;
  }
};

export const obtenerAsignaturaPorId = async (id) => {
  try {
    const response = await apiClient.get(`/asignaturas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerAsignaturaPorId:', error);
    throw error;
  }
};

export const buscarAsignaturas = async (termino) => {
  try {
    const response = await apiClient.get(`/asignaturas/buscar?termino=${termino}`);
    return response.data;
  } catch (error) {
    console.error('Error en buscarAsignaturas:', error);
    throw error;
  }
};

export const crearAsignatura = async (asignaturaData) => {
  try {
    const response = await apiClient.post('/asignaturas', asignaturaData);
    return response.data;
  } catch (error) {
    console.error('Error en crearAsignatura:', error);
    throw error;
  }
};

export const actualizarAsignatura = async (id, asignaturaData) => {
  try {
    const response = await apiClient.put(`/asignaturas/${id}`, asignaturaData);
    return response.data;
  } catch (error) {
    console.error('Error en actualizarAsignatura:', error);
    throw error;
  }
};

export const eliminarAsignatura = async (id) => {
  try {
    const response = await apiClient.delete(`/asignaturas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en eliminarAsignatura:', error);
    throw error;
  }
};
