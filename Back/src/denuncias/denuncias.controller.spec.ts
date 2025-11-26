import { Test, TestingModule } from '@nestjs/testing';
import { DenunciasController } from './denuncias.controller';
import { DenunciasService } from './denuncias.service';
import { DenunciaDto } from './dto/denuncia.dto';
import { edicaoDenunciaDto } from './dto/edicao.denuncia.dto';
import { TipoUsuario } from '@prisma/client';
import { AuthRequest } from 'src/auth/models/authRequest';

const mockDenuncia = { id: 1, descricao: 'Teste', idUsuario: 1 };

// Mock do Service
const mockDenunciasService = {
  criarDenuncia: jest.fn(),
  editarDenuncia: jest.fn(),
  deletarDenuncia: jest.fn(),
  desativarDenuncia: jest.fn(),
  encontrarDenuncia: jest.fn(),
  listarDenuncias: jest.fn(),
};

describe('DenunciasController', () => {
  let controller: DenunciasController;
  let service: DenunciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DenunciasController],
      providers: [
        { provide: DenunciasService, useValue: mockDenunciasService },
      ],
    }).compile();

    controller = module.get<DenunciasController>(DenunciasController);
    service = module.get<DenunciasService>(DenunciasService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  // Helper para simular o Request com User
  const mockRequest = {
    user: { id: 1, tipo: TipoUsuario.COMUM },
  } as unknown as AuthRequest;

  describe('criarDenuncia', () => {
    it('deve chamar o service com ID do usuário logado', async () => {
      const dto: DenunciaDto = { descricao: 'Nova', idCategoria: 1 };
      mockDenunciasService.criarDenuncia.mockResolvedValue(mockDenuncia);

      await controller.criarDenuncia(mockRequest, dto);

      expect(service.criarDenuncia).toHaveBeenCalledWith(mockRequest.user.id, dto);
    });
  });

  describe('editarDenuncia', () => {
    it('deve chamar o service com ID da denúncia e ID do usuário', async () => {
      const dto: edicaoDenunciaDto = { descricao: 'Edit' };
      
      await controller.editarDenuncia(10, mockRequest, dto);

      expect(service.editarDenuncia).toHaveBeenCalledWith(10, mockRequest.user.id, dto);
    });
  });

  describe('deletarDenuncia (Hard Delete)', () => {
    it('deve chamar o service passando a hierarquia do usuário', async () => {
      await controller.deletarDenuncia(5, mockRequest);

      expect(service.deletarDenuncia).toHaveBeenCalledWith(
        5, 
        mockRequest.user.id, 
        mockRequest.user.tipo
      );
    });
  });

  describe('desativarDenuncia (Soft Delete)', () => {
    it('deve chamar o service passando a hierarquia do usuário', async () => {
      await controller.desativarDenuncia(5, mockRequest);

      expect(service.desativarDenuncia).toHaveBeenCalledWith(
        5, 
        mockRequest.user.id, 
        mockRequest.user.tipo
      );
    });
  });

  describe('listarDenuncias', () => {
    it('deve chamar o service listar', async () => {
      await controller.listarDenuncias();
      expect(service.listarDenuncias).toHaveBeenCalled();
    });
  });
});