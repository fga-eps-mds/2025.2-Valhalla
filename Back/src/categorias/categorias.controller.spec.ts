import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasController } from '../categorias.controller';
import { CategoriasService } from '../categorias.service';
import { TipoUsuario } from '@prisma/client';

describe('CategoriasController - deletarCategoria', () => {
  let controller: CategoriasController;
  let service: CategoriasService;

  const req = { user: { tipo: TipoUsuario.ADMINMASTER } } as any;
  const mockCategoria = { id: 1, nome: 'Infraestrutura' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [
        {
          provide: CategoriasService,
          useValue: {
            deletarCategorias: jest.fn().mockResolvedValue(mockCategoria),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriasController>(CategoriasController);
    service = module.get<CategoriasService>(CategoriasService);
  });

  it('Deve deletar categoria quando for ADMINMASTER', async () => {
    const result = await controller.deletarCategoria(1, req);

    expect(service.deletarCategorias).toHaveBeenCalledWith(1, req.user.tipo);
    expect(result).toEqual(mockCategoria);
  });
});
