import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from '../categorias.service';
import { PrismaService } from 'src/database/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';

// Mock dos tipos
const ADMINMASTER = 'ADMINMASTER' as TipoUsuario;
const ADMIN = 'ADMIN' as TipoUsuario;
const COMUM = 'COMUM' as TipoUsuario;

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

  // --- Grupo 1: criarCategorias ---
  describe('criarCategorias', () => {
    const data = { nome: 'Nova Categoria' };

    it('[Sucesso] Deve c
