import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasController } from '../categorias.controller';
import { CategoriasService } from '../categorias.service';
import { mockCategoria } from './mocks'; // se tiver mocks separados

describe('CategoriasController - listarCategorias', () => {
  let controller: CategoriasController;
  let service: CategoriasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [
        {
          provide: CategoriasService,
          useValue: {
            listarCategorias: jest.fn().mockResolvedValue([mockCategoria]),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriasController>(CategoriasController);
    service = module.get<CategoriasService>(CategoriasService);
    jest.clearAllMocks();
  });

  it('Deve chamar o service e retornar a lista de categorias', async () => {
    const result = await controller.listarCategorias();

    expect(service.listarCategorias).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mockCategoria]);
  });
});
