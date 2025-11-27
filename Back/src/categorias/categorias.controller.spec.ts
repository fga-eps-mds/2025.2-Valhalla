import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from '../categorias.service';
import { PrismaService } from 'src/database/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';

// Mocks dos tipos de usuário
const ADMINMASTER = 'ADMINMASTER' as TipoUsuario;
const ADMIN = 'ADMIN' as TipoUsuario;
const COMUM = 'COMUM' as TipoUsuario;

// Mock de categoria
const mockCategoria = { id: 1, nome: 'Infraestrutura' };

// Mock do Prisma
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

  describe('criarCategorias', () => {
    const data = { nome: 'Nova Categoria' };

    it('[Sucesso] Criação por Admin Master: deve criar e retornar a categoria', async () => {
      const result = await s
