import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Cliente axios configurado
const apiClient = axios.create({
  baseURL: API_URL
});

// Export default del cliente
export default apiClient;

export const obtenerDashboard = async () => {
  const response = await apiClient.get('/dashboard');
  return response.data;
};

export const obtenerActividades = async (limit = 10) => {
  const response = await apiClient.get(`/dashboard/actividades?limit=${limit}`);
  return response.data;
};

export const obtenerNotificaciones = async (limit = 5) => {
  const response = await apiClient.get(`/dashboard/notificaciones?limit=${limit}`);
  return response.data;
};

export const obtenerEventos = async (limit = 5) => {
  const response = await apiClient.get(`/dashboard/eventos?limit=${limit}`);
  return response.data;
};
