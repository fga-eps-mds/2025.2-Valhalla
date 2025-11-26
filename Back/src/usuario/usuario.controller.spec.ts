import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { TipoUsuario } from '@prisma/client';
import { AuthRequest } from '../auth/models/authRequest'; // Ajuste o caminho
import { CriacaoUsuarioDto } from './dto/usuario.dto';
import { EdicaoUsuarioDto } from './dto/edicao.usuario.dto';

// Mock do Service
const mockUsuarioService = {
  criarUsuario: jest.fn(),
  deletarUsuario: jest.fn(),
  desativarUsuario: jest.fn(),
  encontrarUsuario: jest.fn(),
  listarUsuario: jest.fn(),
  editarUsuario: jest.fn(),
};

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: UsuarioService;

  // Mock do Request Autenticado
  const mockRequest = {
    user: { id: 10, tipo: TipoUsuario.COMUM, email: 'eu@teste.com' },
  } as unknown as AuthRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    service = module.get<UsuarioService>(UsuarioService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('criarUsuario', () => {
    it('deve chamar service.criarUsuario', async () => {
      const dto = { nome: 'Teste' } as CriacaoUsuarioDto;
      await controller.criarUsuario(dto);
      expect(service.criarUsuario).toHaveBeenCalledWith(dto);
    });
  });

  describe('deletarUsuario (Hard)', () => {
    it('deve extrair ID e Tipo do request e passar para o service', async () => {
      const idAlvo = 5;
      await controller.deletarUsuario(mockRequest, idAlvo);

      expect(service.deletarUsuario).toHaveBeenCalledWith(
        mockRequest.user.id,   // ID do Solicitante (10)
        idAlvo,                // ID do Alvo (5)
        mockRequest.user.tipo  // Tipo do Solicitante (COMUM)
      );
    });
  });

  describe('desativarUsuario (Soft)', () => {
    it('deve extrair ID e Tipo do request e passar para o service', async () => {
      const idAlvo = 5;
      await controller.desativarUsuario(mockRequest, idAlvo);

      expect(service.desativarUsuario).toHaveBeenCalledWith(
        mockRequest.user.id,
        idAlvo,
        mockRequest.user.tipo
      );
    });
  });

  describe('editarUsuario', () => {
    it('deve chamar editar usando o ID do usuário logado (Self-Service)', async () => {
      const dto: EdicaoUsuarioDto = { nome: 'Novo Nome' };
      
      // Note que o controller não recebe ID na rota, ele usa o do token
      await controller.editarUsuario(mockRequest, dto);

      expect(service.editarUsuario).toHaveBeenCalledWith(
        mockRequest.user.id, // 10
        dto
      );
    });
  });
});