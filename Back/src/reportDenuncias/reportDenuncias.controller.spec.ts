import { Test, TestingModule } from '@nestjs/testing';
import { ReportDenunciasController } from './reportDenuncias.controller';
import { ReportDenunciasService } from './reportDenuncias.service';
import { reportDenunciasDto } from './dto/reportDenuncias.dto';

describe('ReportDenunciasController', () => {
  let controller: ReportDenunciasController;
  let service: ReportDenunciasService;

  const mockReport = { id: 1, idUsuario: 1, idDenuncia: 10 };

  const mockService = {
    CriarReportDenuncia: jest.fn(),
    acharTodosReports: jest.fn(),
    deletarReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportDenunciasController],
      providers: [
        { provide: ReportDenunciasService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ReportDenunciasController>(ReportDenunciasController);
    service = module.get<ReportDenunciasService>(ReportDenunciasService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('CriarReport', () => {
    it('deve chamar o service.CriarReportDenuncia', async () => {
      const dto: reportDenunciasDto = { idUsuario: 1, idDenuncia: 10 };
      
      await controller.CriarReport(dto);

      expect(service.CriarReportDenuncia).toHaveBeenCalledWith(dto);
    });
  });

  describe('acharTodos', () => {
    it('deve chamar o service.acharTodosReports', async () => {
      mockService.acharTodosReports.mockResolvedValue([mockReport]);

      const result = await controller.acharTodos();

      expect(result).toEqual([mockReport]);
      expect(service.acharTodosReports).toHaveBeenCalled();
    });
  });

  describe('deletar', () => {
    it('deve chamar o service.deletarReport com o ID correto', async () => {
      mockService.deletarReport.mockResolvedValue(mockReport);


      await controller.deletar(1);

      expect(service.deletarReport).toHaveBeenCalledWith(1);
    });
  });
});