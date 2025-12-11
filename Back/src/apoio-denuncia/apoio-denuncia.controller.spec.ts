import { Test, TestingModule } from '@nestjs/testing';
import { ApoioDenunciaController } from './apoio-denuncia.controller';
import { ApoioDenunciaService } from './apoio-denuncia.service';

describe('ApoioDenunciaController', () => {
  let controller: ApoioDenunciaController;
  let service: ApoioDenunciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApoioDenunciaController],
      providers: [
        {
          provide: ApoioDenunciaService,
          useValue: {
            alternarApoio: jest.fn(),
            contarApoios: jest.fn(), 
            verificarSeUsuarioApoiou: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(ApoioDenunciaController);
    service = module.get(ApoioDenunciaService);
  });

  it('deve chamar service.alternarApoio e retornar o valor', async () => {
    (service.alternarApoio as jest.Mock).mockResolvedValue({ ok: true });

    const result = await controller.alternar({ idUsuario: 1, idDenuncia: 2 });

    expect(service.alternarApoio).toHaveBeenCalledWith({ idUsuario: 1, idDenuncia: 2 });
    expect(result).toEqual({ ok: true });
  });

  it('deve chamar service.contarApoios e retornar o valor', async () => {
    (service.contarApoios as jest.Mock).mockResolvedValue({ idDenuncia: 1, total: 5 });

    const result = await controller.contar(1);

    expect(service.contarApoios).toHaveBeenCalledWith(1);
    expect(result).toEqual({ idDenuncia: 1, total: 5 });
  });

  it('deve chamar service.verificarSeUsuarioApoiou e retornar o valor', async () => {
    (service.verificarSeUsuarioApoiou as jest.Mock).mockResolvedValue({ apoiado: true });

    const result = await controller.verificarStatus(1, 2);

    // The controller passes idDenuncia and idUsuario as separate parameters, not an object
    expect(service.verificarSeUsuarioApoiou).toHaveBeenCalledWith(2, 1);
    expect(result).toEqual({ apoiado: true });
  });
});