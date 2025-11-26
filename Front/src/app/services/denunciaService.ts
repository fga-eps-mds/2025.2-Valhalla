import api from '../../utils/api';

// Define o formato que o Back espera receber
export interface CriarDenunciaDados {
  idUsuario: number;
  descricao: string;
  idCategoria: number;
  anonimato: boolean;
  // mediasrc: string; // Será implementado posteriormente
}

// Função que envia os dados para o Back-end
export const criarDenuncia = async (dados: CriarDenunciaDados) => {
  try {
    // Faz o POST na rota '/denuncias'
    const response = await api.post('/denuncias', dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar denúncia:", error);
    throw error; // Repassa o erro para o modal saber que falhou e avisar o usuário
  }
};

