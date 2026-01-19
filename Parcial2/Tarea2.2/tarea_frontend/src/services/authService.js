import apiClient from './apiService';

export const login = async (username, password) => {
  const response = await apiClient.post('/auth/login', { username, password });
  const { usuario } = response.data;
  
  localStorage.setItem('usuario', JSON.stringify(usuario));
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('usuario');
};

export const getUsuario = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};
