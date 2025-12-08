import { Test, TestingModule } from '@nestjs/testing';
import { NoticiasController } from './noticias.controller';
import { NoticiasService } from './noticias.service';
import { TipoUsuario } from '@prisma/client';
import { NoticiasDto } from './dto/noticias.dto';
import { EdicaoNoticiasDto } from './dto/edicao.noticias.dto';

describe('NoticiasController', () => {
  let controller: NoticiasController;
  let service: NoticiasService;

  // Mock do Service com todas as funções usadas no Controller
  const mockNoticiasService = {
    criarNoticia: jest.fn(),
    listarNoticias: jest.fn(),
    listarNoticiasPorUsuario: jest.fn(),
    encontrarNoticia: jest.fn(),
    editarNoticia: jest.fn(),
    desativarNoticia: jest.fn(),
    deletarNoticia: jest.fn(),
  };

  // Mock do Request (simulando um usuário logado)
  const mockRequest = {
    user: {
      id: 1,
      tipo: TipoUsuario.ADMIN,
      email: 'teste@teste.com'
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticiasController],
      providers: [
        {
          provide: NoticiasService,
          useValue: mockNoticiasService,
        },
      ],
    }).compile();

    controller = module.get<NoticiasController>(NoticiasController);
    service = module.get<NoticiasService>(NoticiasService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('criarNoticia', () => {
    it('deve chamar o service com o ID do usuário logado e os dados', async () => {
      const dto: NoticiasDto = { 
        descricao: 'Nova Notícia', 
        tipo: 'GERAL', 
        idUsuario: 1 
      };
      
      await controller.criarNoticia(mockRequest as any, dto);

      expect(service.criarNoticia).toHaveBeenCalledWith(
        mockRequest.user.id,
        dto,
        mockRequest.user.tipo
      );
    });
  });

  describe('editarNoticia', () => {
    it('deve chamar o service com ID da notícia, ID do usuário e dados', async () => {
      const dto: EdicaoNoticiasDto = { descricao: 'Editada' };
      const idNoticia = 10;

      await controller.editarNoticia(idNoticia, mockRequest as any, dto);

      expect(service.editarNoticia).toHaveBeenCalledWith(
        idNoticia,
        mockRequest.user.id,
        dto,
        mockRequest.user.tipo
      );
    });
  });

  describe('deletarNoticia (Hard Delete)', () => {
    it('deve chamar o método deletarNoticia do service', async () => {
      const idNoticia = 5;

      await controller.deletarNoticia(idNoticia, mockRequest as any);

      expect(service.deletarNoticia).toHaveBeenCalledWith(
        idNoticia,
        mockRequest.user.id,
        mockRequest.user.tipo
      );
    });
  });

  describe('desativarNoticia (Soft Delete)', () => {
    it('deve chamar o método desativarNoticia do service', async () => {
      const idNoticia = 5;

      await controller.desativarNoticia(idNoticia, mockRequest as any);

      expect(service.desativarNoticia).toHaveBeenCalledWith(
        idNoticia,
        mockRequest.user.id,
        mockRequest.user.tipo
      );
    });
  });

  describe('encontrarNoticia', () => {
    it('deve chamar o service com o ID correto', async () => {
      await controller.encontrarNoticia(99);
      expect(service.encontrarNoticia).toHaveBeenCalledWith(99);
    });
  });

  describe('listarNoticias', () => {
    it('deve passar os parâmetros de paginação corretos', async () => {
      const page = 2;
      const limit = 20;

      await controller.listarNoticias(page, limit);

      expect(service.listarNoticias).toHaveBeenCalledWith(page, limit);
    });

    it('deve usar valores padrão se não forem informados (teste implícito via DefaultValuePipe no E2E, aqui testamos a chamada)', async () => {
        // Simulando que o controller recebeu os valores (o Pipe faria a transformação antes)
        await controller.listarNoticias(1, 15);
        expect(service.listarNoticias).toHaveBeenCalledWith(1, 15);
    });
  });

  describe('listarNoticiasPorUsuario', () => {
    it('deve chamar o service com ID do alvo e paginação', async () => {
      const idAlvo = 50;
      const page = 1;
      const limit = 10;

      await controller.listarNoticiasPorUsuario(idAlvo, page, limit);

      expect(service.listarNoticiasPorUsuario).toHaveBeenCalledWith(idAlvo, page, limit);
    });
  });
});
