import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from '../categorias.service';
import { PrismaService } from 'src/database/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';

// Mock categoria
const mockCategoria = { id: 1, nome: 'Infraestrutura' };

// Mock Prisma
const mockPrismaService = {
  categoria: {
    create: jest.fn().mockResolvedValue(mockCategoria),
    findUnique: jest.fn(),
    update: jest.fn().mockResolvedValue({ ...mockCategoria, nome: 'Editado' }),
    delete: jest.fn().mockResolvedValue(mockCategoria),
    findMany: jest.fn(),
  },
};

describe('CategoriasService', () => {
  let service: CategoriasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoriasService>(CategoriasService);
    jest.clearAllMocks();
  });

  // ----------------------------------------------------------
  //  Grupo 1: criarCategorias
  // ----------------------------------------------------------
  describe('criarCategorias', () => {
    const data = { nome: 'Nova Categoria' };

    it('[Sucesso] Deve criar categoria quando for ADMINMASTER', async () => {
      mockPrismaService.categoria.create.mockResolvedValue(mockCategoria);

      const result = await service.criarCategorias(data, TipoUsuario.ADMINMASTER);

      expect(result).toEqual(mockCategoria);
      expect(mockPrismaService.categoria.create).toHaveBeenCalledTimes(1);
    });

    it('[Erro] Deve lançar ForbiddenException se não for ADMINMASTER', async () => {
      await expect(
        service.criarCategorias(data, TipoUsuario.ADMIN),
      ).rejects.toThrow(ForbiddenException);

      expect(mockPrismaService.categoria.create).not.toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------
  //  Grupo 2: editarCategorias
  // ----------------------------------------------------------
  describe('editarCategorias', () => {
    const data = { nome: 'Editado' };

    it('[Sucesso] Deve editar categoria quando for ADMINMASTER', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue(mockCategoria);

      const result = await service.editarCategorias(
        1,
        data,
        TipoUsuario.ADMINMASTER,
      );

      expect(result).toEqual({ ...mockCategoria, nome: 'Editado' });
      expect(mockPrismaService.categoria.update).toHaveBeenCalledTimes(1);
    });

    it('[Erro] Deve lançar NotFoundException se categoria não existir', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue(null);

      await expect(
        service.editarCategorias(1, data, TipoUsuario.ADMINMASTER),
      ).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.categoria.update).not.toHaveBeenCalled();
    });

    it('[Erro] Deve lançar ForbiddenException se usuário não for ADMINMASTER', async () => {
      await expect(
        service.editarCategorias(1, data, TipoUsuario.COMUM),
      ).rejects.toThrow(ForbiddenException);

      expect(mockPrismaService.categoria.update).not.toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------
  //  Grupo 3: deletarCategorias
  // ----------------------------------------------------------
  describe('deletarCategorias', () => {
    it('[Sucesso] Deve deletar categoria quando for ADMINMASTER', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue(mockCategoria);

      const result = await service.deletarCategorias(1, TipoUsuario.ADMINMASTER);

      expect(mockPrismaService.categoria.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(mockPrismaService.categoria.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual(mockCategoria);
    });

    it('[Erro] Deve lançar NotFoundException se categoria não existir', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue(null);

      await expect(
        service.deletarCategorias(1, TipoUsuario.ADMINMASTER),
      ).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.categoria.delete).not.toHaveBeenCalled();
    });

    it('[Erro] Deve lançar ForbiddenException se usuário não for ADMINMASTER', async () => {
      await expect(
        service.deletarCategorias(1, TipoUsuario.COMUM),
      ).rejects.toThrow(ForbiddenException);

      expect(mockPrismaService.categoria.delete).not.toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------
  //  Grupo 4: listarCategorias
  // ----------------------------------------------------------
  describe('listarCategorias', () => {
    it('[Sucesso] Deve listar categorias', async () => {
      mockPrismaService.categoria.findMany.mockResolvedValue([mockCategoria]);

      const result = await service.listarCategorias();

      expect(result).toEqual([mockCategoria]);
      expect(mockPrismaService.categoria.findMany).toHaveBeenCalledTimes(1);
    });

    it('[Erro] Deve lançar NotFoundException se lista estiver vazia', async () => {
      mockPrismaService.categoria.findMany.mockResolvedValue([]);

      await expect(service.listarCategorias()).rejects.toThrow(NotFoundException);
    });
  });

  // ----------------------------------------------------------
  //  Grupo 5: encontrarCategorias
  // ----------------------------------------------------------
  describe('encontrarCategorias', () => {
    it('[Sucesso] Deve retornar categoria pelo ID', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue(mockCategoria);

      const result = await service.encontrarCategorias(1);

      expect(result).toEqual(mockCategoria);
    });

    it('[Erro] Deve lançar NotFoundException se a categoria não existir', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue(null);

      await expect(service.encontrarCategorias(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

