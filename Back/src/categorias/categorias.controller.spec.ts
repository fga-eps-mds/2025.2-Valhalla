import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasController } from '../categorias.controller';
import { CategoriasService } from '../categorias.service';
import { edicaoCategoriasDto } from '../dto/edicao_categorias.dto';
import { TipoUsuario } from '@prisma/client';

describe('CategoriasController - editarCategoria', () => {
  let controller: CategoriasController;
  let service: Partial<Record<keyof CategoriasService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      editarCategorias: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [
        { provide: CategoriasService, useValue: service },
      ],
    }).compile();

    controller = module.get<CategoriasController>(CategoriasController);
  });

  it('Deve chamar o service com ID, DTO e tipo do usuário', async () => {
    const dto: edicaoCategoriasDto = { nome: 'Editado' };
    const req = { user: { tipo: TipoUsuario.ADMINMASTER } } as any;
    service.editarCategorias.mockResolvedValue({ id: 1, nome: 'Editado' });

    const result = await controller.editarCategoria(1, dto, req);

    expect(service.editarCategorias).toHaveBeenCalledWith(1, dto, req.user.tipo);
    expect(result).toEqual({ id: 1, nome: 'Editado' });
  });
});
