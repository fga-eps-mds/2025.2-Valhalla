import { Test, TestingModule } from '@nestjs/testing';
import { DenunciasService } from './denuncias.service';
import { PrismaService } from '../database/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import { DenunciaDto } from './dto/denuncia.dto';
import { edicaoDenunciaDto } from './dto/edicao.denuncia.dto';

// Mock dos dados para os testes
const mockDenuncia = {
  id: 1,
  idUsuario: 1,
  descricao: 'Teste Denuncia',
  idCategoria: 1,
  mediaSrc: 'img.jpg',
  anonimato: false,
  dataDelete: null,
  dataCriacao: new Date(),
  dataUpdate: new Date(),
};

const mockUsuarioAutor = {
  id: 1,
  nome: 'Autor',
  email: 'autor@teste.com',
  senha: 'hash',
  cargo: 'ESTUDANTE',
  tipo: TipoUsuario.COMUM,
  mediaSrc: null,
  dataDelete: null,
};

// Mock do Prisma
const mockPrismaService = {
  denuncia: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  usuario: {
    findUnique: jest.fn(),
  },
};

describe('DenunciasService', () => {
  let service: DenunciasService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DenunciasService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DenunciasService>(DenunciasService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('criarDenuncia', () => {
    it('deve criar uma denúncia com sucesso', async () => {
      const dto: DenunciaDto = { descricao: 'Teste', idCategoria: 1, anonimato: false };
      prisma.denuncia.create.mockResolvedValue(mockDenuncia);

      const result = await service.criarDenuncia(1, dto);

      expect(prisma.denuncia.create).toHaveBeenCalledWith({
        data: {
          idUsuario: 1,
          descricao: dto.descricao,
          idCategoria: dto.idCategoria,
          mediaSrc: undefined, // ou dto.mediaSrc se passado
          anonimato: dto.anonimato,
        },
      });
      expect(result).toEqual(mockDenuncia);
    });
  });

  describe('encontrarDenuncia', () => {
    it('deve retornar uma denúncia se existir e não estiver deletada', async () => {
      prisma.denuncia.findUnique.mockResolvedValue(mockDenuncia);

      const result = await service.encontrarDenuncia(1);
      expect(result).toEqual(mockDenuncia);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      prisma.denuncia.findUnique.mockResolvedValue(null);
      await expect(service.encontrarDenuncia(99)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar NotFoundException se estiver deletada (soft delete)', async () => {
      prisma.denuncia.findUnique.mockResolvedValue({ ...mockDenuncia, dataDelete: new Date() });
      await expect(service.encontrarDenuncia(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('editarDenuncia', () => {
    const dtoEdit: edicaoDenunciaDto = { descricao: 'Editado' };

    it('deve editar se for o dono e não estiver deletada', async () => {
      prisma.denuncia.findUnique.mockResolvedValue(mockDenuncia);
      prisma.denuncia.update.mockResolvedValue({ ...mockDenuncia, descricao: 'Editado' });

      const result = await service.editarDenuncia(1, 1, dtoEdit); // id 1, usuario 1 (dono)

      expect(prisma.denuncia.update).toHaveBeenCalled();
      expect(result.descricao).toEqual('Editado');
    });

    it('deve lançar ForbiddenException se não for o dono', async () => {
      prisma.denuncia.findUnique.mockResolvedValue(mockDenuncia);
      // Tentativa de edição pelo usuário 2 (não dono)
      await expect(service.editarDenuncia(1, 2, dtoEdit)).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar ForbiddenException se a denúncia estiver deletada', async () => {
      prisma.denuncia.findUnique.mockResolvedValue({ ...mockDenuncia, dataDelete: new Date() });
      await expect(service.editarDenuncia(1, 1, dtoEdit)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deletarDenuncia (Hard Delete) & Hierarquia', () => {
    it('deve permitir que o dono delete sua denúncia', async () => {
      // Mock da denúncia
      prisma.denuncia.findUnique.mockResolvedValue(mockDenuncia);
      // Mock do autor da denúncia (para a lógica de hierarquia)
      prisma.usuario.findUnique.mockResolvedValue(mockUsuarioAutor);
      prisma.denuncia.delete.mockResolvedValue(mockDenuncia);

      // Usuário 1 (dono) deletando denúncia 1
      await service.deletarDenuncia(1, 1, TipoUsuario.COMUM);

      expect(prisma.denuncia.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve permitir que ADMIN delete denúncia de COMUM', async () => {
      prisma.denuncia.findUnique.mockResolvedValue(mockDenuncia); // Autor é ID 1
      prisma.usuario.findUnique.mockResolvedValue({ ...mockUsuarioAutor, tipo: TipoUsuario.COMUM }); // Autor é COMUM

      // Usuário 2 (ADMIN) deletando denúncia do Usuário 1
      await service.deletarDenuncia(1, 2, TipoUsuario.ADMIN);

      expect(prisma.denuncia.delete).toHaveBeenCalled();
    });

    it('deve BLOQUEAR que COMUM delete denúncia de terceiros', async () => {
      prisma.denuncia.findUnique.mockResolvedValue(mockDenuncia);
      prisma.usuario.findUnique.mockResolvedValue(mockUsuarioAutor);

      // Usuário 2 (COMUM) tentando deletar denúncia do Usuário 1
      await expect(service.deletarDenuncia(1, 2, TipoUsuario.COMUM)).rejects.toThrow(ForbiddenException);
    });

    it('deve BLOQUEAR que ADMIN delete denúncia de ADMIN', async () => {
      prisma.denuncia.findUnique.mockResolvedValue(mockDenuncia);
      // Autor da denúncia agora é um ADMIN
      prisma.usuario.findUnique.mockResolvedValue({ ...mockUsuarioAutor, id: 99, tipo: TipoUsuario.ADMIN });

      // Usuário 2 (ADMIN) tentando deletar denúncia do Usuário 99 (ADMIN)
      await expect(service.deletarDenuncia(1, 2, TipoUsuario.ADMIN)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('desativarDenuncia (Soft Delete)', () => {
    it('deve realizar o soft delete corretamente', async () => {
      prisma.denuncia.findUnique.mockResolvedValue(mockDenuncia);
      prisma.usuario.findUnique.mockResolvedValue(mockUsuarioAutor);
      prisma.denuncia.update.mockResolvedValue({ ...mockDenuncia, dataDelete: new Date() });

      await service.desativarDenuncia(1, 1, TipoUsuario.COMUM);

      expect(prisma.denuncia.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ dataDelete: expect.any(Date) })
      }));
    });
  });

  describe('listarDenuncias', () => {
    it('deve listar apenas denúncias não deletadas', async () => {
      prisma.denuncia.findMany.mockResolvedValue([mockDenuncia]);

      await service.listarDenuncias();

      expect(prisma.denuncia.findMany).toHaveBeenCalledWith({
        where: { dataDelete: null },
        orderBy: { id: 'desc' },
      });
    });
  });
});