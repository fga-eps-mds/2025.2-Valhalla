import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasController } from '../categorias.controller';
import { CategoriasService } from '../categorias.service';
import { NotFoundException } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';

// Mock categoria
const mockCategoria = { id: 1, nome: 'Infraestrutura' };

// Mock service
const mockCategoriasService = {
  encontrarCategorias: jest.fn(),
};

describe('CategoriasController - encontrarCategorias', () => {
  let controller: CategoriasController;
  let service: CategoriasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [
        { provide: CategoriasService, useValue: mockCategoriasService },
      ],
    }).compile();

    controller = module.get<CategoriasController>(CategoriasController);
    service = module.get<CategoriasService>(CategoriasService);
    jest.clearAllMocks();
  });

  it('[Sucesso] Deve retornar categoria pelo ID', async () => {
    mockCategoriasService.encontrarCategorias.mockResolvedValue(mockCategoria);

    const result = await controller.encontrarCategorias(1);

    expect(service.encontrarCategorias).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockCategoria);
  });

  it('[Erro] Deve lançar NotFoundException se categoria não existir', async () => {
    mockCategoriasService.encontrarCategorias.mockImplementation(() => {
      throw new NotFoundException('Categoria não encontrada!');
    });

    await expect(controller.encontrarCategorias(999)).rejects.toThrow(
      NotFoundException,
    );
    expect(service.encontrarCategorias).toHaveBeenCalledWith(999);
  });
});
