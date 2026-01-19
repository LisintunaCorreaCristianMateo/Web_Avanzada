import apiClient from './apiService';

export const obtenerCursos = async () => {
  try {
    const response = await apiClient.get('/cursos');
    return response.data;
  } catch (error) {
    console.error('Error en obtenerCursos:', error);
    throw error;
  }
};

export const obtenerCursoPorId = async (id) => {
  try {
    const response = await apiClient.get(`/cursos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerCursoPorId:', error);
    throw error;
  }
};

export const buscarCursos = async (termino) => {
  try {
    const response = await apiClient.get(`/cursos/buscar?termino=${termino}`);
    return response.data;
  } catch (error) {
    console.error('Error en buscarCursos:', error);
    throw error;
  }
};

export const crearCurso = async (cursoData) => {
  try {
    const response = await apiClient.post('/cursos', cursoData);
    return response.data;
  } catch (error) {
    console.error('Error en crearCurso:', error);
    throw error;
  }
};

export const actualizarCurso = async (id, cursoData) => {
  try {
    const response = await apiClient.put(`/cursos/${id}`, cursoData);
    return response.data;
  } catch (error) {
    console.error('Error en actualizarCurso:', error);
    throw error;
  }
};

export const eliminarCurso = async (id) => {
  try {
    const response = await apiClient.delete(`/cursos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en eliminarCurso:', error);
    throw error;
  }
};
