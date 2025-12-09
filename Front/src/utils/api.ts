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

export interface CriarNoticiaDados {
  descricao: string;
  tipo: string;
  mediaSrc?: string;
  idUsuario: number;
}

export interface EditarNoticiaDados {
  descricao?: string;
  tipo?: string;
  mediaSrc?: string;
}
export const criarNoticia = async (dados: CriarNoticiaDados) => {
  const response = await api.post('/noticias', dados);
  return response.data;
};

export const listarNoticias = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/noticias?page=${page}&limit=${limit}`);
  return response.data; 
};

export const listarNoticiasPorUsuario = async (idUsuario: number, page: number = 1, limit: number = 10) => {
  const response = await api.get(`/noticias/usuario/${idUsuario}?page=${page}&limit=${limit}`);
  return response.data;
};

export const editarNoticia = async (id: number, dados: EditarNoticiaDados) => {
  const response = await api.patch(`/noticias/${id}`, dados);
  return response.data;
};

export const desativarNoticia = async (id: number) => {
  const response = await api.delete(`/noticias/${id}`);
  return response.data;
};

export const deletarNoticiaPermanente = async (id: number) => {
  const response = await api.delete(`/noticias/delete-permanente/${id}`);
  return response.data;
};
