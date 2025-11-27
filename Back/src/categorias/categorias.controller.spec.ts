import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from '../categorias.service';
import { PrismaService } from 'src/database/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';

// Mock categoria
const mockCategoria = { id: 1, nome: 'Infraestrutura' };

// Mock Prisma
const mockPrismaService = {
  categoria: {
    create: jest.fn().mockResolvedValue(mockCategoria),
  },
};

describe('CategoriasService - criarCategorias', () => {
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

  it('[Sucesso] Deve criar categoria quando for ADMINMASTER', async () => {
    const data = { nome: 'Nova Categoria' };

    const result = await service.criarCategorias(data, TipoUsuario.ADMINMASTER);

    expect(result).toEqual(mockCategoria);
    expect(mockPrismaService.categoria.create).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.categoria.create).toHaveBeenCalledWith({ data });
  });

  it('[Erro] Deve lançar ForbiddenException se não for ADMINMASTER', async () => {
    const data = { nome: 'Nova Categoria' };

    await expect(
      service.criarCategorias(data, TipoUsuario.ADMIN),
    ).rejects.toThrow(ForbiddenException);

    await expect(
      service.criarCategorias(data, TipoUsuario.COMUM),
    ).rejects.toThrow(ForbiddenException);

    expect(mockPrismaService.categoria.create).not.toHaveBeenCalled();
  });
});
