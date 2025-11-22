/*
import { Test, TestingModule } from '@nestjs/testing';
import { DenunciasController } from './denuncias.controller';
import { DenunciasService } from './denuncias.service';

// Mock do Service (Simula a lógica de negócio)
const mockDenunciasService = {
  criarDenuncia: jest.fn().mockResolvedValue({ id: 1, descricao: 'Criada' }),
  editarDenuncia: jest.fn().mockResolvedValue({ id: 1, descricao: 'Editada' }),
  deletarDenuncia: jest.fn().mockResolvedValue({ id: 1 }), // Permanente
  desativarDenuncia: jest.fn().mockResolvedValue({ id: 1, dataDelete: new Date() }), // Soft
  encontrarDenuncia: jest.fn().mockResolvedValue({ id: 1 }),
  listarDenuncias: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
};

describe('DenunciasController', () => {
  let controller: DenunciasController;
  let service: typeof mockDenunciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DenunciasController],
      providers: [
        {
          provide: DenunciasService,
          useValue: mockDenunciasService,
        },
      ],
    }).compile();

    controller = module.get<DenunciasController>(DenunciasController);
    service = module.get(DenunciasService); // Pega o mock injetado
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar criarDenuncia no service', async () => {
    const dto = { idUsuario: 1, descricao: 'Teste', idCategoria: 1 };
    await controller.criarDenuncia(dto);
    expect(service.criarDenuncia).toHaveBeenCalledWith(dto);
  });

  it('deve chamar editarDenuncia no service com ID correto', async () => {
    const dto = { descricao: 'Nova desc' };
    await controller.editarDenuncia(1, dto);
    expect(service.editarDenuncia).toHaveBeenCalledWith(1, dto);
  });

  it('deve chamar desativarDenuncia (soft delete) no service', async () => {
    await controller.desativarDenuncia(1);
    expect(service.desativarDenuncia).toHaveBeenCalledWith(1);
  });
});
*/