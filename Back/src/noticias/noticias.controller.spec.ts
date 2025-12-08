import { Test, TestingModule } from '@nestjs/testing';
import { NoticiasController } from './noticias.controller';
import { NoticiasService } from './noticias.service';

describe('NoticiasController', () => {
  let controller: NoticiasController;

  const mockNoticiasService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    desativarNoticia: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticiasController],
      providers: [
        {
          provide: NoticiasService,
          useValue: mockNoticiasService,
        },
      ],
    }).compile();

    controller = module.get<NoticiasController>(NoticiasController);
  });

  
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
