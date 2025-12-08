import { Test, TestingModule } from '@nestjs/testing';
import { ReportDenunciasService } from './report-denuncias.service';

describe('ReportDenunciasService', () => {
  let service: ReportDenunciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportDenunciasService],
    }).compile();

    service = module.get<ReportDenunciasService>(ReportDenunciasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
