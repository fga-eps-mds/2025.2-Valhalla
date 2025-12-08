import { Test, TestingModule } from '@nestjs/testing';
import { ReportDenunciasController } from './report-denuncias.controller';

describe('ReportDenunciasController', () => {
  let controller: ReportDenunciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportDenunciasController],
    }).compile();

    controller = module.get<ReportDenunciasController>(ReportDenunciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
