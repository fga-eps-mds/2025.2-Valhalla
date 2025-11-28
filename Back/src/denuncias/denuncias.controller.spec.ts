import { Test, TestingModule } from '@nestjs/testing';
import { DenunciasController } from './denuncias.controller';
import { DenunciasService } from './denuncias.service';
import { TipoUsuario } from '@prisma/client';

// Mock do Serviço
const mockDenunciasService = {
  criarDenuncia: jest.fn(),
  editarDenuncia: jest.fn(),
  deletarDenuncia: jest.fn(),
  desativarDenuncia: jest.fn(),
  encontrarDenuncia: jest.fn(),
  listarDenuncias: jest.fn().mockResolvedValue({denuncias: [], totalDenuncias: 0}),
  listarDenunciasPorUsuario: jest.fn().mockResolvedValue({denuncias: [], totalDenuncias: 0}),
};

// Dados Mocks
const mockUserId = 10;
const mockDenunciaId = 1;
const mockDto = { descricao: 'Descrição Teste', idCategoria: 1, anonimato: false };
const mockEdicaoDto = { descricao: 'Edição Teste' };
const mockListResult = { denuncias: [{id: 1}], totalDenuncias: 1 };

const mockRequest = (tipo: TipoUsuario, userId: number = mockUserId) => ({
  user: {
    id: userId,
    tipo: tipo,
  },
} as any);


describe('DenunciasController', () => {
  let controller: DenunciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DenunciasController],
      providers: [
        {
          provide: DenunciasService,
          useValue: mockDenunciasService,
        },
      ],
    }).compile();

    controller = module.get<DenunciasController>(DenunciasController);
    jest.clearAllMocks();
  });
  describe('CRUD Básico', () => {
    const req = mockRequest(TipoUsuario.COMUM);

    it('[Integração] Criar: Deve chamar service.criarDenuncia passando req.user.id e DTO', async () => {
      await controller.criarDenuncia(req, mockDto as any);
      expect(mockDenunciasService.criarDenuncia).toHaveBeenCalledWith(mockUserId, mockDto);
    });
    it('[Integração] Editar: Deve chamar service.editarDenuncia passando id, req.user.id e DTO', async () => {
      await controller.editarDenuncia(mockDenunciaId, req, mockEdicaoDto as any);
      expect(mockDenunciasService.editarDenuncia).toHaveBeenCalledWith(mockDenunciaId, mockUserId, mockEdicaoDto);
    });
    it('[Integração] Deletar: Deve chamar service.deletarDenuncia passando id, req.user.id e req.user.tipo', async () => {
      await controller.deletarDenuncia(mockDenunciaId, req);
      expect(mockDenunciasService.deletarDenuncia).toHaveBeenCalledWith(mockDenunciaId, mockUserId, TipoUsuario.COMUM);
    });
    it('[Integração] Desativar: Deve chamar service.desativarDenuncia passando id, req.user.id e req.user.tipo', async () => {
      await controller.desativarDenuncia(mockDenunciaId, req);
      expect(mockDenunciasService.desativarDenuncia).toHaveBeenCalledWith(mockDenunciaId, mockUserId, TipoUsuario.COMUM);
    });
 });
 describe('Busca e Listagem (Público)', () => {

    it('[Integração] Encontrar por ID: Deve chamar service.encontrarDenuncia apenas com o ID', async () => {
      await controller.encontrarDenuncia(mockDenunciaId);
      expect(mockDenunciasService.encontrarDenuncia).toHaveBeenCalledWith(mockDenunciaId);
    });
    it('[Integração] Listar Geral: Deve repassar QueryParams (page, limit) para service.listarDenuncias', async () => {
      mockDenunciasService.listarDenuncias.mockResolvedValue(mockListResult);
      const result = await controller.listarDenuncias(2, 20); // page: 2, limit: 20
      
      expect(mockDenunciasService.listarDenuncias).toHaveBeenCalledWith(2, 20);
      expect(result).toEqual(mockListResult);
    });
    it('[Integração] Listar por Usuário: Deve repassar ID, page e limit para service.listarDenunciasPorUsuario', async () => {
      mockDenunciasService.listarDenunciasPorUsuario.mockResolvedValue(mockListResult);
      const idUsuarioTarget = 5;
      const result = await controller.listarDenunciasPorUsuario(idUsuarioTarget, 3, 5); // ID: 5, page: 3, limit: 5
      
      expect(mockDenunciasService.listarDenunciasPorUsuario).toHaveBeenCalledWith(idUsuarioTarget, 3, 5);
      expect(result).toEqual(mockListResult);
    });
 });
});
