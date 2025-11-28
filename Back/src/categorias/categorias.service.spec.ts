import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from './categorias.service';
import { PrismaService } from '../database/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import { criarCategoriasDto } from './dto/create_categorias.dto';
import { edicaoCategoriasDto } from './dto/edicao_categorias.dto';

// Mocks de Dados
const mockCategoria = {
  id: 1,
  nome: 'Infraestrutura',
};

// Mock do Prisma
const mockPrismaService = {
  categoria: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('CategoriasService', () => {
  let service: CategoriasService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoriasService>(CategoriasService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  // --- CRIAR ---
  describe('criarCategorias', () => {
    it('[Condição] Deve criar categoria se usuário for ADMINMASTER', async () => {
      const dto: criarCategoriasDto = { nome: 'Nova Categoria' };
      prisma.categoria.create.mockResolvedValue(mockCategoria);

      const result = await service.criarCategorias(dto, TipoUsuario.ADMINMASTER);

      expect(prisma.categoria.create).toHaveBeenCalledWith({
        data: { nome: dto.nome },
      });
      expect(result).toEqual(mockCategoria);
    });

    it('[Erro] Deve lançar ForbiddenException se usuário NÃO for ADMINMASTER', async () => {
      const dto: criarCategoriasDto = { nome: 'Teste' };
      
      await expect(service.criarCategorias(dto, TipoUsuario.ADMIN))
        .rejects.toThrow(ForbiddenException);
    });
  });

  // --- EDITAR ---
  describe('editarCategorias', () => {
    const dto: edicaoCategoriasDto = { nome: 'Editado' };

    it('[Condição] Deve editar categoria se usuário for ADMINMASTER e categoria existir', async () => {
      prisma.categoria.findUnique.mockResolvedValue(mockCategoria); // Existe
      prisma.categoria.update.mockResolvedValue({ ...mockCategoria, nome: 'Editado' });

      const result = await service.editarCategorias(1, dto, TipoUsuario.ADMINMASTER);

      expect(prisma.categoria.update).toHaveBeenCalled();
      expect(result.nome).toEqual('Editado');
    });

    it('[Erro] Deve lançar ForbiddenException se usuário NÃO for ADMINMASTER', async () => {
      await expect(service.editarCategorias(1, dto, TipoUsuario.ADMIN))
        .rejects.toThrow(ForbiddenException);
    });

    it('[Erro] Deve lançar NotFoundException se categoria não existir', async () => {
      prisma.categoria.findUnique.mockResolvedValue(null); // Não existe

      await expect(service.editarCategorias(99, dto, TipoUsuario.ADMINMASTER))
        .rejects.toThrow(NotFoundException);
    });
  });

  // --- DELETAR ---
  describe('deletarCategorias', () => {
    it('[Condição] Deve deletar categoria se usuário for ADMINMASTER', async () => {
      prisma.categoria.findUnique.mockResolvedValue(mockCategoria);
      prisma.categoria.delete.mockResolvedValue(mockCategoria);

      await service.deletarCategorias(1, TipoUsuario.ADMINMASTER);

      expect(prisma.categoria.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('[Erro] Deve lançar ForbiddenException se usuário NÃO for ADMINMASTER', async () => {
      await expect(service.deletarCategorias(1, TipoUsuario.COMUM))
        .rejects.toThrow(ForbiddenException);
    });

    it('[Erro] Deve lançar NotFoundException se categoria não existir', async () => {
      prisma.categoria.findUnique.mockResolvedValue(null);

      await expect(service.deletarCategorias(99, TipoUsuario.ADMINMASTER))
        .rejects.toThrow(NotFoundException);
    });
  });

  // --- LISTAR ---
  describe('listarCategorias', () => {
    it('[Sucesso] Deve retornar lista de categorias', async () => {
      prisma.categoria.findMany.mockResolvedValue([mockCategoria]);
      
      const result = await service.listarCategorias();
      expect(result).toEqual([mockCategoria]);
    });

    it('[Erro] Deve lançar NotFoundException se a lista estiver vazia', async () => {
      prisma.categoria.findMany.mockResolvedValue([]); // Array vazio
      
      await expect(service.listarCategorias()).rejects.toThrow(NotFoundException);
    });
  });
  describe('encontrarCategorias', () => {
    it('[Sucesso] Deve retornar uma categoria pelo ID', async () => {
      prisma.categoria.findUnique.mockResolvedValue(mockCategoria);
      
      const result = await service.encontrarCategorias(1);
      expect(result).toEqual(mockCategoria);
    });

    it('[Erro] Deve lançar NotFoundException se categoria não existir', async () => {
       prisma.categoria.findUnique.mockResolvedValue(null);
      
      await expect(service.encontrarCategorias(2))
         .rejects.toThrow(NotFoundException);
    });
  });
});