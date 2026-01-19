import apiClient from './apiService';

export const obtenerEstudiantes = async (buscar = '', estado = 'activo') => {
  const params = new URLSearchParams();
  if (buscar) params.append('buscar', buscar);
  if (estado) params.append('estado', estado);
  
  const url = `/estudiantes${params.toString() ? '?' + params.toString() : ''}`;
  
  try {
    console.log('LLAMADA API GET', url);
    const response = await apiClient.get(url);
    console.log('RESPUESTA API GET', response.data);
    return response.data;
  } catch (err) {
    console.error('Error en obtenerEstudiantes:', err);
    throw err;
  }
};

export const obtenerEstudiantePorId = async (id) => {
  const response = await apiClient.get(`/estudiantes/${id}`);
  return response.data;
};

// Búsqueda general (mantener compatibilidad)
export const buscarEstudiantes = async (termino) => {
  const response = await apiClient.get(`/estudiantes?buscar=${encodeURIComponent(termino)}`);
  return response.data;
};

// Nueva búsqueda avanzada
export const buscarEstudiantesAvanzada = async (termino, tipo = 'general') => {
  const params = new URLSearchParams({
    q: termino
  });
  
  if (tipo !== 'general') {
    params.append('tipo', tipo);
  }
  
  try {
    const response = await apiClient.get(`/estudiantes/buscar?${params}`);
    return response.data;
  } catch (err) {
    console.error('Error en búsqueda avanzada:', err);
    throw err;
  }
};

export const crearEstudiante = async (formData) => {
  const response = await apiClient.post('/estudiantes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const actualizarEstudiante = async (id, formData) => {
  const response = await apiClient.put(`/estudiantes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const eliminarEstudiante = async (id) => {
  const response = await apiClient.delete(`/estudiantes/${id}`);
  return response.data;
};
