import { Test, TestingModule } from '@nestjs/testing';
import { ApoioDenunciaService } from './apoio-denuncia.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

// Mock
const mockPrismaService = {
  denuncia: {
    findUnique: jest.fn(), 
  },
  apoiosDenuncia: {
    findUnique: jest.fn(), 
    create: jest.fn(),    
    delete: jest.fn(),     
    count: jest.fn(),  
  },
};

describe('Testes do Serviço de Apoio à Denúncia', () => {
  let service: ApoioDenunciaService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    // zera o contador de chamadas das funções
    jest.clearAllMocks();

    // módulo de teste 
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApoioDenunciaService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, 
        },
      ],
    }).compile();

    service = module.get<ApoioDenunciaService>(ApoioDenunciaService);
    prisma = module.get(PrismaService);
  });

  // Teste simples para verificar se o serviço subiu
  it('O serviço deve estar definido e rodando', () => {
    expect(service).toBeDefined();
  });
});