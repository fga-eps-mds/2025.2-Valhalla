import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('valhalla_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUsuario = async (email: string, senha: string) => {
  const response = await api.post("/auth/login", { email, senha });
  return response.data;
};

export const getOneUsuario = async (id: number) => {
  const response = await api.get(`/Usuario/${id}`); 
  return response.data;
};

export const EmailRecuperação = async (email: string) => {
  const response = await api.post('/auth/esqueci-senha/', {email}); 
  return response.data;
};

export const resetarSenha = async (token: string, senha: string) => {
  const response = await api.post('/auth/reset-password',  {token: token, novaSenha: senha}); 
  return response.data;
};

export default api;