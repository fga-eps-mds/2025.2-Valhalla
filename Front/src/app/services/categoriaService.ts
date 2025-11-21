import api from '../utils/api'; // Importa configuração do axios

// Define o formato dos dados que o Back-end entrega
export interface Categoria {
  id: number;
  nome: string;
}

export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    // Chama a rota REAL do Back-end: http://localhost:3001/categoria
    const response = await api.get('/categoria');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return []; // Retorna lista vazia se der erro
  }
};