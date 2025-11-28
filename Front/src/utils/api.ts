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

export const loginUsuario = async (email: string, senha: string, lembrar: boolean) => {
  const response = await api.post("/auth/login", { email, senha, lembrar });
  return response.data;
};

export const getOneUsuario = async (id: number) => {
  const response = await api.get(`/usuarios/${id}`); 
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

export const mudarSenha = async (senhaAntiga: string, senhaNova: string) => {
  const response = await api.patch('/auth/mudar-senha',  {senhaAntiga: senhaAntiga, senhaNova: senhaNova}); 
  return response.data;
};
export const excluirContaSoft = async (id: number) => {
  const response = await api.delete(`/usuarios/${id}`); 
  return response.data;
};

interface DadosEdicao {
  nome?: string;
  mediaSrc?: string;
}

export const editarUsuario = async (dados: DadosEdicao) => {
  const response = await api.patch('/usuarios', dados); 
  return response.data;
};
export default api;