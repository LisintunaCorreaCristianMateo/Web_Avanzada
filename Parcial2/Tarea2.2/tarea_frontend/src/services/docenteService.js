import apiClient from './apiService';

export const obtenerDocentes = async (buscar = '') => {
  const url = buscar ? `/docentes?buscar=${encodeURIComponent(buscar)}` : '/docentes';
  const response = await apiClient.get(url);
  return response.data;
};

export const obtenerDocentePorId = async (id) => {
  const response = await apiClient.get(`/docentes/${id}`);
  return response.data;
};

export const buscarDocentes = async (termino) => {
  const response = await apiClient.get(`/docentes?buscar=${encodeURIComponent(termino)}`);
  return response.data;
};

export const crearDocente = async (formData) => {
  const response = await apiClient.post('/docentes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const actualizarDocente = async (id, formData) => {
  const response = await apiClient.put(`/docentes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const eliminarDocente = async (id) => {
  const response = await apiClient.delete(`/docentes/${id}`);
  return response.data;
};
