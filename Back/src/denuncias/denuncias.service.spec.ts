import { Test, TestingModule } from '@nestjs/testing';
import { DenunciasService } from './denuncias.service';
import { PrismaService } from 'src/database/prisma.service';
import { DenunciaDto } from './dto/denuncia.dto';
import { edicaoDenunciaDto } from './dto/edicao.denuncia.dto';

// Mock dos dados (Exemplos)
const mockDenuncia = {
  id: 1,
  idUsuario: 1,
  descricao: 'Denúncia teste',
  idCategoria: 1,
  mediasrc: 'http://img.com',
  anonimato: false,
  dataDelete: null,
};



// Mock do Prisma (Simula o comportamento do banco)
const mockPrismaService = {
  denuncia: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('DenunciasService', () => {
  let service: DenunciasService;
  let prisma: typeof mockPrismaService;

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
    prisma = module.get(PrismaService);
    
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  // 1. Teste do CREATE
  describe('criarDenuncia', () => {
    it('deve criar uma denúncia com sucesso', async () => {
      const dto: DenunciaDto = {
        idUsuario: 1,
        descricao: 'Nova denúncia',
        idCategoria: 1,
        mediasrc: 'url',
        anonimato: false,
      };

      prisma.denuncia.create.mockResolvedValue(mockDenuncia);

      const result = await service.criarDenuncia(dto);

      expect(result).toEqual(mockDenuncia);
      expect(prisma.denuncia.create).toHaveBeenCalledTimes(1);
      expect(prisma.denuncia.create).toHaveBeenCalledWith({
        data: {
          idUsuario: dto.idUsuario,
          descricao: dto.descricao,
          idCategoria: dto.idCategoria,
          mediasrc: dto.mediasrc,
          anonimato: dto.anonimato,
        },
      });
    });
  });

  // 2. Teste do EDITAR (PATCH)
  describe('editarDenuncia', () => {
    it('deve editar uma denúncia existente', async () => {
      const dto: edicaoDenunciaDto = { descricao: 'Descrição Atualizada' };
      
      // Simula que a denúncia existe
      prisma.denuncia.findUnique.mockResolvedValue(mockDenuncia);
      // Simula a atualização
      prisma.denuncia.update.mockResolvedValue({ ...mockDenuncia, ...dto });

      const result = await service.editarDenuncia(1, dto);

      expect(result.descricao).toEqual('Descrição Atualizada');
      expect(prisma.denuncia.update).toHaveBeenCalled();
    });

    it('deve lançar erro se a denúncia não existir ao editar', async () => {
      // Simula que NÃO encontrou nada (null)
      prisma.denuncia.findUnique.mockResolvedValue(null);

      const dto: edicaoDenunciaDto = { descricao: 'teste' };
      await expect(service.editarDenuncia(99, dto)).rejects.toThrow('Denúncia não encontrada!');
    });
  });

  // 3. Teste do DELETE PERMANENTE
  describe('deletarDenuncia', () => {
    it('deve deletar a denúncia se ela existir', async () => {
      prisma.denuncia.findUnique.mockResolvedValue(mockDenuncia);
      prisma.denuncia.delete.mockResolvedValue(mockDenuncia);

      await service.deletarDenuncia(1);

      expect(prisma.denuncia.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve lançar erro se tentar deletar denúncia inexistente', async () => {
      prisma.denuncia.findUnique.mockResolvedValue(null);
      await expect(service.deletarDenuncia(99)).rejects.toThrow('Denúncia não encontrada!');
    });
  });

  // 4. Teste do SOFT DELETE (Desativar)
  describe('desativarDenuncia', () => {
    it('deve realizar o soft delete (atualizar dataDelete)', async () => {
      prisma.denuncia.findUnique.mockResolvedValue(mockDenuncia);
      
      // Simula o retorno com dataDelete preenchido
      const deletedDenuncia = { ...mockDenuncia, dataDelete: new Date() };
      prisma.denuncia.update.mockResolvedValue(deletedDenuncia);

      const result = await service.desativarDenuncia(1);

      expect(prisma.denuncia.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { dataDelete: expect.any(Date) }, // Verifica se enviou uma data
      });
      expect(result.dataDelete).not.toBeNull();
    });
  });

  // 5. Teste do FIND ONE
  describe('encontrarDenuncia', () => {
    it('deve retornar a denúncia pelo ID', async () => {
      prisma.denuncia.findUnique.mockResolvedValue(mockDenuncia);

      const result = await service.encontrarDenuncia(1);
      expect(result).toEqual(mockDenuncia);
    });

    it('deve lançar erro se o ID for inválido ou não enviado', async () => {
        // Seu código verifica "if (!id)", então testamos passando 0 ou undefined mascarado
        await expect(service.encontrarDenuncia(0)).rejects.toThrow('Denuncia não Encontrada!');
    });
  });
});