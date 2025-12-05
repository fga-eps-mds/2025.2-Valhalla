import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { PrismaService } from '../database/prisma.service';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CargoUsuario, TipoUsuario } from '@prisma/client';
import { CriacaoUsuarioDto } from './dto/usuario.dto';
import { EdicaoUsuarioDto } from './dto/edicao.usuario.dto';

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

const mockUsuarioDeletado = { ...mockUsuarioDb, dataDelete: new Date() };

const mockUsuarioAdmin = { ...mockUsuarioDb, id: 2, tipo: TipoUsuario.ADMIN };
const mockUsuarioMaster = { ...mockUsuarioDb, id: 3, tipo: TipoUsuario.ADMINMASTER };

// Mock do Prisma
const mockPrismaService = {
  usuario: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
    count: jest.fn(),
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

  // --- CRIAÇÃO ---
  describe('criarUsuario', () => {
    const dto: CriacaoUsuarioDto = {
        nome: 'Novo', email: 'novo@unb.br', senha: '123', cargo: CargoUsuario.ESTUDANTE, tipo: TipoUsuario.COMUM,
    };

    it('[Sucesso] Deve criar usuário comum', async () => {
      prisma.usuario.findFirst.mockResolvedValue(null); // Sem Master conflito
      prisma.usuario.create.mockResolvedValue(mockUsuarioDb);

      const result = await service.criarUsuario(dto);
      expect(result).toEqual(mockUsuarioDb);
    });

    it('[Erro] Deve lançar Forbidden se tentar criar ADMIN sem estar logado (Requester undefined)', async () => {
      const dtoAdmin = { ...dto, tipo: TipoUsuario.ADMIN };
      // Não passamos o segundo argumento (UsuarioSolicitante)
      await expect(service.criarUsuario(dtoAdmin)).rejects.toThrow(ForbiddenException);
    });

    it('[Erro] Deve lançar Forbidden se ADMIN tentar criar outro usuário privilegiado', async () => {
      const dtoAdmin = { ...dto, tipo: TipoUsuario.ADMIN };
      // Solicitante é apenas ADMIN, não MASTER
      await expect(service.criarUsuario(dtoAdmin, { tipo: TipoUsuario.ADMIN }))
        .rejects.toThrow(new ForbiddenException("Ação não autorizada! Somente ADMINMASTER pode criar usuários com privilégios elevados."));
    });

    it('[Erro] Deve impedir a criação de um segundo ADMINMASTER', async () => {
      const dtoMaster = { ...dto, tipo: TipoUsuario.ADMINMASTER };
      // Já existe um master no banco
      prisma.usuario.findFirst.mockResolvedValue(mockUsuarioMaster);

      await expect(service.criarUsuario(dtoMaster, { tipo: TipoUsuario.ADMINMASTER }))
        .rejects.toThrow(new ForbiddenException("Já existe um ADMINMASTER cadastrado no sistema!"));
    });

    it('[Erro] Deve relançar erro genérico de banco de dados', async () => {
      prisma.usuario.create.mockRejectedValue(new Error('Erro Desconhecido'));
      await expect(service.criarUsuario(dto)).rejects.toThrow('Erro ao criar usuário: Erro Desconhecido');
    });

    it('[Erro] Deve lançar ConflictException se email duplicado', async () => {
       prisma.usuario.create.mockRejectedValue({ code: 'P2002' });
       await expect(service.criarUsuario(dto)).rejects.toThrow(ConflictException);
    });
  });

  // --- LISTAGEM E BUSCA ---
  describe('Listagem e Busca', () => {
    it('listarUsuario: deve retornar lista paginada e total', async () => {
        prisma.usuario.findMany.mockResolvedValue([mockUsuarioDb]);
        prisma.usuario.count.mockResolvedValue(1);

        const res = await service.listarUsuario(1, 10);
        
        expect(prisma.usuario.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 0, take: 10 }));
        expect(res).toHaveProperty('usuarios');
        expect(res).toHaveProperty('totalUsuarios');
    });

    it('encontrarUsuario: deve retornar usuário existente', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioDb);
        const res = await service.encontrarUsuario(1);
        expect(res).toEqual(mockUsuarioDb);
    });

    it('encontrarUsuario: deve lançar NotFound se usuário não existe', async () => {
        prisma.usuario.findUnique.mockResolvedValue(null);
        await expect(service.encontrarUsuario(99)).rejects.toThrow(NotFoundException);
    });

    it('encontrarUsuario: deve lançar NotFound se usuário foi deletado (Soft Delete)', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioDeletado);
        await expect(service.encontrarUsuario(1)).rejects.toThrow(NotFoundException);
    });

    it('procurarPorEmail: deve buscar pelo email ignorando deletados', async () => {
        await service.procurarPorEmail('email@teste.com');
        expect(prisma.usuario.findFirst).toHaveBeenCalledWith({ where: { email: 'email@teste.com', dataDelete: null } });
    });

    it('encontrarUsuarioAuth: deve retornar usuario simples para auth', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioDb);
        await service.encontrarUsuarioAuth(1);
        expect(prisma.usuario.findUnique).toHaveBeenCalled();
    });

    it('encontrarUsuarioAuth: erro se não achar', async () => {
        prisma.usuario.findUnique.mockResolvedValue(null);
        await expect(service.encontrarUsuarioAuth(1)).rejects.toThrow(NotFoundException);
    });
  });

  // --- EDIÇÃO ---
  describe('editarUsuario', () => {
    const dtoEdicao: EdicaoUsuarioDto = { nome: 'Nome Editado' };

    it('[Sucesso] Deve editar usuário', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioDb);
        prisma.usuario.update.mockResolvedValue(mockUsuarioDb);

        await service.editarUsuario(1, dtoEdicao);
        expect(prisma.usuario.update).toHaveBeenCalled();
    });

    it('[Erro] Não deve editar usuário inexistente ou deletado', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioDeletado);
        await expect(service.editarUsuario(1, dtoEdicao)).rejects.toThrow(NotFoundException);
    });

    it('[Erro] Deve proibir edição de senha sem a flag de segurança', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioDb);
        // Tentando passar senha no DTO sem a flag {senha: true}
        await expect(service.editarUsuario(1, { senha: '123' }, { senha: false }))
            .rejects.toThrow(new ForbiddenException("Ação não autorizada! Para editar a senha, utilize o meio apropriado."));
    });

    it('[Erro] Conflito de email na edição', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioDb);
        prisma.usuario.update.mockRejectedValue({ code: 'P2002' });
        
        await expect(service.editarUsuario(1, dtoEdicao)).rejects.toThrow(ConflictException);
    });

    it('[Erro] Deve relançar outros erros na edição', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioDb);
        prisma.usuario.update.mockRejectedValue(new Error('Erro X'));
        
        await expect(service.editarUsuario(1, dtoEdicao)).rejects.toThrow('Erro X');
    });
  });

  // --- HIERARQUIA, DELEÇÃO E DESATIVAÇÃO ---
// --- 4. HIERARQUIA, DELEÇÃO E DESATIVAÇÃO ---
  describe('Hierarquia e Deleção (RBAC)', () => {
    
    it('[Sucesso] Deve desativar usuário (Soft Delete)', async () => {
        prisma.usuario.findUnique.mockResolvedValueOnce(mockUsuarioDb); // Passa na Hierarquia
        prisma.usuario.findUnique.mockResolvedValueOnce(null); // Passa na checagem de "já deletado"
        
        // CORREÇÃO: Forçamos o update a dar sucesso, sobrescrevendo o "Erro X" do teste anterior
        prisma.usuario.update.mockResolvedValue(mockUsuarioDb);

        await service.desativarUsuario(1, 1, TipoUsuario.COMUM);
        
        expect(prisma.usuario.update).toHaveBeenCalledWith(
            expect.objectContaining({ data: { dataDelete: expect.any(Date) } })
        );
    });

    it('[Erro] Não deve desativar usuário já deletado', async () => {
        prisma.usuario.findUnique.mockResolvedValueOnce(mockUsuarioDb);
        prisma.usuario.findUnique.mockResolvedValueOnce(mockUsuarioDeletado); // Já deletado
        
        await expect(service.desativarUsuario(1, 1, TipoUsuario.COMUM)).rejects.toThrow(NotFoundException);
    });

    it('[Erro] Falha se usuário alvo não existe na checagem de hierarquia', async () => {
        prisma.usuario.findUnique.mockResolvedValue(null);
        await expect(service.deletarUsuario(1, 99, TipoUsuario.COMUM)).rejects.toThrow("Usuário Não Encontrado!");
    });

    it('[Sucesso] Auto-delete (COMUM)', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioDb);
        // Garantimos que o delete retorna algo para não dar erro
        prisma.usuario.delete.mockResolvedValue(mockUsuarioDb);

        await service.deletarUsuario(1, 1, TipoUsuario.COMUM);
        expect(prisma.usuario.delete).toHaveBeenCalled();
    });

    it('[Erro] Comum deletando outro', async () => {
        prisma.usuario.findUnique.mockResolvedValue({ ...mockUsuarioDb, id: 2 });
        await expect(service.deletarUsuario(1, 2, TipoUsuario.COMUM)).rejects.toThrow(ForbiddenException);
    });

    it('[Erro] Admin deletando AdminMaster', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioMaster);
        await expect(service.deletarUsuario(2, 3, TipoUsuario.ADMIN)).rejects.toThrow(ForbiddenException);
    });

    it('[Erro] Admin deletando outro Admin', async () => {
        prisma.usuario.findUnique.mockResolvedValue({ ...mockUsuarioAdmin, id: 5 });
        await expect(service.deletarUsuario(2, 5, TipoUsuario.ADMIN)).rejects.toThrow(ForbiddenException);
    });

    it('[Sucesso] Admin deletando Comum', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioDb);
        prisma.usuario.delete.mockResolvedValue(mockUsuarioDb);
        
        await service.deletarUsuario(2, 1, TipoUsuario.ADMIN);
        expect(prisma.usuario.delete).toHaveBeenCalled();
    });

    it('[Erro] Master deletando a si mesmo', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioMaster);
        await expect(service.deletarUsuario(3, 3, TipoUsuario.ADMINMASTER)).rejects.toThrow("Ação não autorizada! Admin Master não pode ser deletado");
    });

    it('[Sucesso] Master deletando Admin', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioAdmin);
        prisma.usuario.delete.mockResolvedValue(mockUsuarioDb);

        await service.deletarUsuario(3, 2, TipoUsuario.ADMINMASTER);
        expect(prisma.usuario.delete).toHaveBeenCalled();
    });

    it('[Erro] Tipo desconhecido (Switch Default)', async () => {
        prisma.usuario.findUnique.mockResolvedValue(mockUsuarioDb);
        await expect(service.deletarUsuario(1, 2, 'HACKER' as any)).rejects.toThrow(ForbiddenException);
    });
    
    it('[Erro] Fallback final', async () => {
         // Simula um caso onde entra no switch mas não cai em nenhum if de return true
         prisma.usuario.findUnique.mockResolvedValue({ ...mockUsuarioDb, id: 2, tipo: 'ALIEN' as any });
         await expect(service.deletarUsuario(5, 2, TipoUsuario.ADMIN)).rejects.toThrow(ForbiddenException);
    });
    it('[Erro] Master NÃO pode deletar OUTRO Master (Cobre o break da linha 209)', async () => {
        // Cenário: O alvo (ID 4) é um ADMINMASTER
        const outroMaster = { ...mockUsuarioMaster, id: 4 };
        prisma.usuario.findUnique.mockResolvedValue(outroMaster);

        // Ação: AdminMaster (ID 3) tenta deletar AdminMaster (ID 4)
        // Isso faz o código passar pelos ifs, cair no break e ir para o erro final
        await expect(service.deletarUsuario(3, 4, TipoUsuario.ADMINMASTER))
            .rejects.toThrow(ForbiddenException);
    });
  });
});