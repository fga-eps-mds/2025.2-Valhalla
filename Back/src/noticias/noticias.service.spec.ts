import { Test, TestingModule } from '@nestjs/testing';
import { NoticiasService } from './noticias.service';

describe('NoticiasService', () => {
  let service: NoticiasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoticiasService],
    }).compile();

    service = module.get<NoticiasService>(NoticiasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
