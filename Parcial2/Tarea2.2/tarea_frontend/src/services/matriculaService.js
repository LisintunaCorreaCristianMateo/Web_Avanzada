import apiClient from './apiService';

export const crearMatricula = async (matriculaData) => {
  try {
    const response = await apiClient.post('/matriculas', matriculaData);
    return response.data;
  } catch (error) {
    console.error('Error en crearMatricula:', error);
    throw error;
  }
};

export const obtenerMatriculasPorEstudiante = async (estudianteId) => {
  try {
    const response = await apiClient.get(`/matriculas/estudiante/${estudianteId}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerMatriculasPorEstudiante:', error);
    throw error;
  }
};

export const eliminarMatricula = async (id) => {
  try {
    const response = await apiClient.delete(`/matriculas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en eliminarMatricula:', error);
    throw error;
  }
};
