import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { criarCategoriasDto } from './dto/create_categorias.dto';
import { edicaoCategoriasDto } from './dto/edicao_categorias.dto';
import { TipoUsuario } from '@prisma/client';
import { AuthRequest } from 'src/auth/models/authRequest';

// Mock do Service
const mockCategoriasService = {
  criarCategorias: jest.fn(),
  editarCategorias: jest.fn(),
  deletarCategorias: jest.fn(),
  encontrarCategorias: jest.fn(),
  listarCategorias: jest.fn(),
};

describe('CategoriasController', () => {
  let controller: CategoriasController;
  let service: CategoriasService;

  // Helper para simular Request Autenticado
  const mockRequest = {
    user: { id: 1, tipo: TipoUsuario.ADMINMASTER },
  } as unknown as AuthRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [
        { provide: CategoriasService, useValue: mockCategoriasService },
      ],
    }).compile();

    controller = module.get<CategoriasController>(CategoriasController);
    service = module.get<CategoriasService>(CategoriasService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('criarCategorias', () => {
    it('deve chamar service com DTO e tipo do usuário', async () => {
      const dto: criarCategoriasDto = { nome: 'Nova' };
      await controller.criarCategorias(dto, mockRequest);

      expect(service.criarCategorias).toHaveBeenCalledWith(dto, mockRequest.user?.tipo);
    });
  });

  describe('editarCategoria', () => {
    it('deve chamar service com ID, DTO e tipo do usuário', async () => {
      const dto: edicaoCategoriasDto = { nome: 'Editado' };
      await controller.editarCategoria(1, dto, mockRequest);

      expect(service.editarCategorias).toHaveBeenCalledWith(1, dto, mockRequest.user?.tipo);
    });
  });

  describe('deletarCategoria', () => {
    it('deve chamar service com ID e tipo do usuário', async () => {
      await controller.deletarCategoria(1, mockRequest);

      expect(service.deletarCategorias).toHaveBeenCalledWith(1, mockRequest.user?.tipo);
    });
  });

  describe('encontrarCategorias', () => {
    it('deve chamar service com ID', async () => {
      await controller.encontrarCategorias(1);
      expect(service.encontrarCategorias).toHaveBeenCalledWith(1);
    });
  });

  describe('listarCategorias', () => {
    it('deve chamar service listar', async () => {
      await controller.listarCategorias();
      expect(service.listarCategorias).toHaveBeenCalled();
    });
  });
});