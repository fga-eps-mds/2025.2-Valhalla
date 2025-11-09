import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from '../src/categorias/categorias.service';
import { PrismaService } from 'src/database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { criarCategoriasDto } from '../src/categorias/dto/create_categorias.dto';
import { edicaoCategoriasDto } from '../src/categorias/dto/edicao_categorias.dto';

// Mock do PrismaService
const mockPrismaService = {
  categoria: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('CategoriasService', () => {
  let service: CategoriasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriasService>(CategoriasService);
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('criarCategorias', () => {
    it('deve criar e retornar uma nova categoria', async () => {
      const dto: criarCategoriasDto = { id: 1, nome: 'Tecnologia' };
      const categoriaCriada = { id: 1, nome: 'Tecnologia' };

      mockPrismaService.categoria.create.mockResolvedValue(categoriaCriada);

      const result = await service.criarCategorias(dto);

      expect(result).toEqual(categoriaCriada);
      expect(mockPrismaService.categoria.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('editarCategorias', () => {
    it('deve editar e retornar a categoria', async () => {
      const dto: edicaoCategoriasDto = { nome: 'Ciência' };
      const categoriaExistente = { id: 1, nome: 'Tecnologia' };
      const categoriaAtualizada = { id: 1, nome: 'Ciência' };

      mockPrismaService.categoria.findUnique.mockResolvedValue(categoriaExistente);
      mockPrismaService.categoria.update.mockResolvedValue(categoriaAtualizada);

      const result = await service.editarCategorias(1, dto);

      expect(result).toEqual(categoriaAtualizada);
      expect(mockPrismaService.categoria.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPrismaService.categoria.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });

    it('deve lançar NotFoundException se a categoria não existir', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue(null);

      await expect(service.editarCategorias(99, { nome: 'Inexistente' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletarCategorias', () => {
    it('deve deletar e retornar a categoria', async () => {
      const categoriaExistente = { id: 1, nome: 'Tecnologia' };
      mockPrismaService.categoria.findUnique.mockResolvedValue(categoriaExistente);
      mockPrismaService.categoria.delete.mockResolvedValue(categoriaExistente);

      const result = await service.deletarCategorias(1);

      expect(result).toEqual(categoriaExistente);
      expect(mockPrismaService.categoria.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve lançar NotFoundException se a categoria não existir', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue(null);

      await expect(service.deletarCategorias(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('encontrarCategorias', () => {
    it('deve encontrar e retornar uma categoria pelo id', async () => {
      const categoria = { id: 1, nome: 'Tecnologia' };
      mockPrismaService.categoria.findUnique.mockResolvedValue(categoria);

      const result = await service.encontrarCategorias(1);

      expect(result).toEqual(categoria);
      expect(mockPrismaService.categoria.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve lançar NotFoundException se a categoria não for encontrada', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue(null);

      await expect(service.encontrarCategorias(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('listarCategorias', () => {
    it('deve retornar uma lista de categorias', async () => {
      const listaCategorias = [
        { id: 1, nome: 'Tecnologia' },
        { id: 2, nome: 'Saúde' },
      ];
      mockPrismaService.categoria.findMany.mockResolvedValue(listaCategorias);

      const result = await service.listarCategorias();

      expect(result).toEqual(listaCategorias);
      expect(mockPrismaService.categoria.findMany).toHaveBeenCalledTimes(1);
    });
  });
});