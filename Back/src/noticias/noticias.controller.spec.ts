import { Test, TestingModule } from '@nestjs/testing';
import { NoticiasController } from './noticias.controller';

describe('NoticiasController', () => {
  let controller: NoticiasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticiasController],
    }).compile();

    controller = module.get<NoticiasController>(NoticiasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
