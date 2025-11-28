import { Test, TestingModule } from '@nestjs/testing';
import { DenunciasService } from './denuncias.service';
import { PrismaService } from 'src/database/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';

// Mocks de Dados
const mockDenuncia = { 
  id: 1, idUsuario: 10, descricao: 'Buraco na via', idCategoria: 1, anonimato: false, mediaSrc: null, dataDelete: null,
};
const mockDenunciaDeletada = { ...mockDenuncia, dataDelete: new Date() };
const mockDenunciaAdmin = { ...mockDenuncia, idUsuario: 20 };

const mockUsuarioComum = { id: 10, tipo: TipoUsuario.COMUM };
const mockUsuarioAdmin = { id: 20, tipo: TipoUsuario.ADMIN };
const mockUsuarioMaster = { id: 30, tipo: TipoUsuario.ADMINMASTER };

const mockDto = { descricao: 'Nova descrição', idCategoria: 2, anonimato: true };
const mockCategoria = { id: 2, nome: 'Mock Cat' };
const mockListaDenuncias = [mockDenuncia, {...mockDenuncia, id: 2}];

// Mock do Prisma Service (Atualizado para paginação)
const mockPrismaService = {
  denuncia: {
    create: jest.fn().mockResolvedValue(mockDenuncia),
    findUnique: jest.fn(),
    findMany: jest.fn().mockResolvedValue(mockListaDenuncias),
    update: jest.fn().mockResolvedValue(mockDenuncia),
    delete: jest.fn().mockResolvedValue(mockDenuncia),
    count: jest.fn().mockResolvedValue(2),
  },
  usuario: {
    findUnique: jest.fn(),
  },
  categoria: { 
    findUnique: jest.fn(),
  }
};

describe('DenunciasService', () => {
  let service: DenunciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DenunciasService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DenunciasService>(DenunciasService);
    jest.clearAllMocks();
  });
  describe('criarDenuncia', () => {
    it('[Sucesso] Deve criar a denúncia vinculando o idUsuario e verificar a categoria', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue({ id: 2 });
      
      const idUsuarioAutor = 10;
      await service.criarDenuncia(idUsuarioAutor, mockDto as any);

      expect(mockPrismaService.denuncia.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            idUsuario: idUsuarioAutor,
            idCategoria: mockDto.idCategoria
          })
        })
      );
    });

    it('[Erro] Deve lançar NotFoundException se a Categoria não for encontrada', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue(null);
      
      await expect(service.criarDenuncia(10, mockDto as any)).rejects.toThrow(
        new NotFoundException('Categoria não encontrada!'),
      );
    });
  });
});