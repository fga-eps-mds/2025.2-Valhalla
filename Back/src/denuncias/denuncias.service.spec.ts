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
    describe('editarDenuncia', () => {
    const idDenuncia = 1;

    it('[Sucesso] Deve permitir a Edição pelo Dono (Denúncia Ativa)', async () => {
      mockPrismaService.denuncia.findUnique.mockResolvedValue(mockDenuncia);
      
      await service.editarDenuncia(idDenuncia, 10, mockDto as any); 

      expect(mockPrismaService.denuncia.update).toHaveBeenCalled();
     });
    it('[Erro] Deve lançar NotFoundException se Denúncia não existe', async () => {
      mockPrismaService.denuncia.findUnique.mockResolvedValue(null);
      
      await expect(service.editarDenuncia(idDenuncia, 10, mockDto as any)).rejects.toThrow(
        new NotFoundException('Denúncia não encontrada!'),
      );
    });
    it('[Erro] Deve lançar ForbiddenException se Usuário não for o dono', async () => {
      mockPrismaService.denuncia.findUnique.mockResolvedValue(mockDenuncia); 
      
      await expect(service.editarDenuncia(idDenuncia, 99, mockDto as any)).rejects.toThrow( 
        new ForbiddenException('Usuário não autorizado a editar esta denúncia!'),
      );
    });
    it('[Erro] Deve lançar ForbiddenException se Denúncia já estiver desativada', async () => {
      mockPrismaService.denuncia.findUnique.mockResolvedValue(mockDenunciaDeletada); // dataDelete preenchido
      
      await expect(service.editarDenuncia(idDenuncia, 10, mockDto as any)).rejects.toThrow(
        new ForbiddenException('Não é possível editar uma denúncia desativada!'),
      );
    });  
    });
   describe('encontrarDenuncia', () => {
    it('[Sucesso] Deve retornar a denúncia ativa', async () => {
      mockPrismaService.denuncia.findUnique.mockResolvedValue(mockDenuncia);
      
      const res = await service.encontrarDenuncia(1);
      expect(res).toEqual(mockDenuncia);
    });
    it('[Erro] Deve lançar NotFoundException se denúncia não existe (null)', async () => {
      mockPrismaService.denuncia.findUnique.mockResolvedValue(null);
      
      await expect(service.encontrarDenuncia(1)).rejects.toThrow(
        new NotFoundException('Denuncia não Encontrada!'),
      );
    });

    it('[Erro] Deve lançar NotFoundException se denúncia foi deletada', async () => {
      mockPrismaService.denuncia.findUnique.mockResolvedValue(mockDenunciaDeletada);
      
      await expect(service.encontrarDenuncia(1)).rejects.toThrow(
        new NotFoundException('Denuncia não Encontrada!'),
      );
    }); 
  }); 
  describe('listarDenuncias', () => {
    it('[Sucesso] Deve listar com paginação e retornar total', async () => {
      const page = 2;
      const limit = 10;
      const skipExpected = (page - 1) * limit; // 10

      const result = await service.listarDenuncias(page, limit);

            // Localize o teste "Deve listar com paginação e retornar total"
        expect(mockPrismaService.denuncia.findMany).toHaveBeenCalledWith({
        where: { 
        dataDelete: null, 
        usuario: { dataDelete: null } // O filtro extra que você adicionou
        },
        orderBy: { id: 'desc' },        // A ordenação
        skip: expect.any(Number),       // skip calculado
        take: limit,
        select: {                       // O select exato que está no service
        id: true,
        descricao: true,
        idCategoria: true,
        mediaSrc: true,
        anonimato: true,
        dataCriacao: true,
        dataUpdate: true,
        idUsuario: true,
        usuario: {
          select: {
            nome: true,
            mediaSrc: true,
          }
        },
        categoria: {
          select: {
            nome: true,
          }
        }
        }
        });
      expect(mockPrismaService.denuncia.count).toHaveBeenCalled();
      
      expect(result).toHaveProperty('denuncias');
      expect(result).toHaveProperty('totalDenuncias');
    });
  });
  describe('listarDenunciasPorUsuario', () => {
    it('[Sucesso] Deve listar por usuário com paginação', async () => {
      const idUsuario = 10;
      const page = 1;
      const limit = 5;

      await service.listarDenunciasPorUsuario(idUsuario, page, limit);

      expect(mockPrismaService.denuncia.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { dataDelete: null, idUsuario: idUsuario },
          skip: 0,
          take: limit
        })
      );
      expect(mockPrismaService.denuncia.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: { dataDelete: null, idUsuario: idUsuario } })
      );
    });
  });
  describe('RBAC - Deletar e Desativar', () => {
    const idDenuncia = 1;
    const setupRBAC = (denuncia: any, usuarioDono: any) => {
      mockPrismaService.denuncia.findUnique.mockResolvedValue(denuncia);
      mockPrismaService.usuario.findUnique.mockResolvedValue(usuarioDono);
    };

    it('[Sucesso] Dono (Comum) pode deletar sua denúncia', async () => {
      setupRBAC(mockDenuncia, mockUsuarioComum); // Dono é Comum
      await service.deletarDenuncia(idDenuncia, 10, TipoUsuario.COMUM as any);
      expect(mockPrismaService.denuncia.delete).toHaveBeenCalled();
    });
    it('[Erro] Comum NÃO pode deletar denúncia de outro', async () => {
      setupRBAC(mockDenuncia, mockUsuarioComum);
      await expect(
        service.deletarDenuncia(idDenuncia, 99, TipoUsuario.COMUM as any)
      ).rejects.toThrow(ForbiddenException);
    });
    it('[Sucesso] Admin pode deletar denúncia de Comum', async () => {
      setupRBAC(mockDenuncia, mockUsuarioComum); 
      await service.deletarDenuncia(idDenuncia, 20, TipoUsuario.ADMIN as any); 
      expect(mockPrismaService.denuncia.delete).toHaveBeenCalled();
    });
    it('[Erro] Admin NÃO pode deletar denúncia de outro Admin', async () => {
      setupRBAC(mockDenunciaAdmin, mockUsuarioAdmin); 
      await expect(
        service.deletarDenuncia(idDenuncia, 25, TipoUsuario.ADMIN as any) 
      ).rejects.toThrow(ForbiddenException);
    });
    it('[Sucesso] Master pode deletar denúncia de Admin', async () => {
      setupRBAC(mockDenunciaAdmin, mockUsuarioAdmin);
      await service.deletarDenuncia(idDenuncia, 30, TipoUsuario.ADMINMASTER as any);
      expect(mockPrismaService.denuncia.delete).toHaveBeenCalled();
    });
    it('[Erro] Desativar deve falhar se denúncia já tiver dataDelete', async () => {
        mockPrismaService.denuncia.findUnique
            .mockResolvedValueOnce(mockDenuncia)
            .mockResolvedValueOnce(mockDenunciaDeletada);
        
        mockPrismaService.usuario.findUnique.mockResolvedValue(mockUsuarioComum);

        await expect(
            service.desativarDenuncia(idDenuncia, 10, TipoUsuario.COMUM as any)
        ).rejects.toThrow(new NotFoundException("Denuncia não encontrada!"));
    });
    it('[Sucesso] Deve desativar denúncia (Linha 75)', async () => {
        // 1. Mock para passar na Hierarquia (Denúncia existe)
        mockPrismaService.denuncia.findUnique.mockResolvedValueOnce(mockDenuncia);
        // 2. Mock para passar na Hierarquia (Usuário existe)
        mockPrismaService.usuario.findUnique.mockResolvedValueOnce(mockUsuarioComum);
        
        // 3. Mock CRÍTICO: Retorna NULL para dizer que "NÃO tem dataDelete" ainda
        mockPrismaService.denuncia.findUnique.mockResolvedValueOnce(null);

        await service.desativarDenuncia(idDenuncia, 10, TipoUsuario.COMUM as any);

        expect(mockPrismaService.denuncia.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ dataDelete: expect.any(Date) })
            })
        );
    }); // <--- O ERRO ESTAVA AQUI, AGORA ESTÁ FECHADO

    it('[Erro] Deve falhar se a denúncia não existir durante a verificação de hierarquia (Linha 182)', async () => {
        mockPrismaService.denuncia.findUnique.mockResolvedValue(null);

        await expect(
            service.deletarDenuncia(idDenuncia, 10, TipoUsuario.COMUM as any)
        ).rejects.toThrow(new NotFoundException("Denuncia Não Encontrado!"));
    });

    it('[Erro] Deve falhar se o dono da denúncia não existir (Linha 192)', async () => {
        mockPrismaService.denuncia.findUnique.mockResolvedValue(mockDenuncia);
        mockPrismaService.usuario.findUnique.mockResolvedValue(null);

        await expect(
            service.deletarDenuncia(idDenuncia, 10, TipoUsuario.COMUM as any)
        ).rejects.toThrow(new NotFoundException("Usuário Não Encontrado!"));
    });

    it('[Erro] Admin NÃO pode deletar denúncia de um AdminMaster (Linha 205)', async () => {
        mockPrismaService.denuncia.findUnique.mockResolvedValue(mockDenuncia);
        // O dono da denúncia é um MASTER
        mockPrismaService.usuario.findUnique.mockResolvedValue(mockUsuarioMaster);

        await expect(
            service.deletarDenuncia(idDenuncia, 20, TipoUsuario.ADMIN as any)
        ).rejects.toThrow(ForbiddenException);
    });

    it('[Erro] Tipo de usuário desconhecido deve cair no default (Linhas 219-222)', async () => {
        mockPrismaService.denuncia.findUnique.mockResolvedValue(mockDenuncia);
        mockPrismaService.usuario.findUnique.mockResolvedValue(mockUsuarioComum);

        await expect(
            service.deletarDenuncia(idDenuncia, 99, 'HACKER' as any)
        ).rejects.toThrow(ForbiddenException);
    });

    it('[Erro] Admin NÃO pode deletar denúncia de outro Admin (Linha 213)', async () => {
        // Cenário: Denúncia pertence a um Admin (ID 25)
        mockPrismaService.denuncia.findUnique.mockResolvedValue({ ...mockDenuncia, idUsuario: 25 });
        mockPrismaService.usuario.findUnique.mockResolvedValue({ id: 25, tipo: TipoUsuario.ADMIN });

        // Ação: Outro Admin (ID 20) tenta deletar
        await expect(
            service.deletarDenuncia(idDenuncia, 20, TipoUsuario.ADMIN as any)
        ).rejects.toThrow(ForbiddenException);
    });

    // Cobre a linha 222 (Fallback final)
    it('[Erro] Admin tentando deletar dono com tipo desconhecido deve cair no erro final (Linha 222)', async () => {
        // Cenário: O dono da denúncia tem um tipo "ALIEN" que não existe no sistema
        // Isso faz o código entrar no case ADMIN, não dar match em nada, dar break e ir pra última linha
        mockPrismaService.denuncia.findUnique.mockResolvedValue({ ...mockDenuncia, idUsuario: 99 });
        mockPrismaService.usuario.findUnique.mockResolvedValue({ id: 99, tipo: 'ALIEN_TYPE' });

        // Ação: Admin tenta deletar
        await expect(
            service.deletarDenuncia(idDenuncia, 20, TipoUsuario.ADMIN as any)
        ).rejects.toThrow(ForbiddenException);
    });
  });
});
});