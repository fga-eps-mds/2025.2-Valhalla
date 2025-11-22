import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { PrismaService } from '../database/prisma.service';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CargoUsuario, TipoUsuario } from '@prisma/client';
import { CriacaoUsuarioDto } from './dto/usuario.dto';

// Mocks de Dados
const mockUsuarioDb = {
  id: 1,
  nome: 'Teste',
  email: 'teste@unb.br',
  senha: 'hashed_password',
  cargo: CargoUsuario.ESTUDANTE,
  tipo: TipoUsuario.COMUM,
  mediaSrc: null,
  dataDelete: null,
  dataCriacao: new Date(),
  dataUpdate: new Date(),
};

const mockUsuarioSafe = {
  id: 1,
  nome: 'Teste',
  email: 'teste@unb.br',
  cargo: CargoUsuario.ESTUDANTE,
  tipo: TipoUsuario.COMUM,
  mediaSrc: null,
  dataCriacao: new Date(),
  dataUpdate: new Date(),
};

// Mock do Prisma
const mockPrismaService = {
  usuario: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  },
};

describe('UsuarioService', () => {
  let service: UsuarioService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  // --- CRIAÇÃO ---
  describe('criarUsuario', () => {
    it('deve criar usuário com sucesso (hash senha e select)', async () => {
      const dto: CriacaoUsuarioDto = {
        nome: 'Novo',
        email: 'novo@unb.br',
        senha: '123',
        cargo: CargoUsuario.ESTUDANTE,
        tipo: TipoUsuario.COMUM,
      };

      // Simula retorno do create já com o select aplicado
      prisma.usuario.create.mockResolvedValue(mockUsuarioSafe);

      const result = await service.criarUsuario(dto);

      expect(prisma.usuario.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ email: dto.email }),
        select: expect.any(Object), // Garante que usou o select
      }));
      expect(result).toEqual(mockUsuarioSafe);
      expect(result).not.toHaveProperty('senha');
    });

    it('deve lançar ConflictException se email duplicado (P2002)', async () => {
      const dto: CriacaoUsuarioDto = {
        nome: 'Duplo', email: 'existente@unb.br', senha: '123', cargo: CargoUsuario.OUTRO
      };
      
      prisma.usuario.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.criarUsuario(dto)).rejects.toThrow(ConflictException);
    });
  });

  // --- HIERARQUIA E DELEÇÃO (RBAC) ---
  describe('Regras de Hierarquia (deletar/desativar)', () => {
    
    // Caso 1: Auto-exclusão (COMUM)
    it('COMUM deve poder deletar a si mesmo', async () => {
      prisma.usuario.findUnique.mockResolvedValue(mockUsuarioDb); // Alvo existe
      
      // ID 1 deletando ID 1
      await service.deletarUsuario(1, 1, TipoUsuario.COMUM);
      expect(prisma.usuario.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    // Caso 2: COMUM deletando outro
    it('COMUM NÃO deve poder deletar terceiros', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ ...mockUsuarioDb, id: 2 }); // Alvo é outro
      
      // ID 1 tentando deletar ID 2
      await expect(service.deletarUsuario(1, 2, TipoUsuario.COMUM))
        .rejects.toThrow(ForbiddenException);
    });

    // Caso 3: ADMIN deletando COMUM
    it('ADMIN deve poder deletar COMUM', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ ...mockUsuarioDb, tipo: TipoUsuario.COMUM });

      await service.deletarUsuario(99, 1, TipoUsuario.ADMIN); // Admin deletando Comum
      expect(prisma.usuario.delete).toHaveBeenCalled();
    });

    // Caso 4: ADMIN deletando ADMIN
    it('ADMIN NÃO deve poder deletar outro ADMIN', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ ...mockUsuarioDb, tipo: TipoUsuario.ADMIN });

      await expect(service.deletarUsuario(99, 2, TipoUsuario.ADMIN))
        .rejects.toThrow(ForbiddenException);
    });

    // Caso 5: MASTER deletando ADMIN
    it('ADMINMASTER deve poder deletar ADMIN', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ ...mockUsuarioDb, tipo: TipoUsuario.ADMIN });

      await service.deletarUsuario(999, 2, TipoUsuario.ADMINMASTER);
      expect(prisma.usuario.delete).toHaveBeenCalled();
    });

    // Caso 6: MASTER deletando MASTER
    it('ADMINMASTER NÃO deve poder deletar outro MASTER', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ ...mockUsuarioDb, tipo: TipoUsuario.ADMINMASTER });

      await expect(service.deletarUsuario(999, 2, TipoUsuario.ADMINMASTER))
        .rejects.toThrow(ForbiddenException);
    });

    // Caso 7: MASTER deletando a SI MESMO
    it('ADMINMASTER NÃO deve poder se auto-deletar (Segurança)', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ ...mockUsuarioDb, id: 999, tipo: TipoUsuario.ADMINMASTER });

      // ID 999 tentando deletar ID 999
      await expect(service.deletarUsuario(999, 999, TipoUsuario.ADMINMASTER))
        .rejects.toThrow(ForbiddenException);
    });
  });

  // --- BUSCA ---
  describe('encontrarUsuario', () => {
    it('deve lançar NotFoundException se usuário não existir', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);
      await expect(service.encontrarUsuario(99)).rejects.toThrow(NotFoundException);
    });
  });
});