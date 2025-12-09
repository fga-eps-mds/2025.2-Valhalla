import { Test, TestingModule } from '@nestjs/testing';
import { ReportDenunciasService } from './report-denuncias.service';
import { PrismaService } from '../database/prisma.service';
import { reportDenunciasDto } from './dto/report-denuncias.dto';
import { NotFoundException } from '@nestjs/common';


const mockReport = {
  id: 1,
  idDenuncia: 10,
  idUsuario: 5,
  dataCriacao: new Date(),
};

const mockPrismaService = {
  reportsDenuncia: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ReportDenunciasService', () => {
  let service: ReportDenunciasService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportDenunciasService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReportDenunciasService>(ReportDenunciasService);
    prisma = module.get(PrismaService); 
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('CriarReportDenuncia', () => {
    it('deve chamar o prisma.create com os dados corretos', async () => {
      const dto: reportDenunciasDto = { idUsuario: 5, idDenuncia: 10 };
      
      prisma.reportsDenuncia.create.mockResolvedValue(mockReport);

      await service.CriarReportDenuncia(dto);

      expect(prisma.reportsDenuncia.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('acharTodosReports', () => {
    it('deve retornar uma lista de reports', async () => {
      const listaReports = [mockReport, { ...mockReport, id: 2 }];
      prisma.reportsDenuncia.findMany.mockResolvedValue(listaReports);

      const result = await service.acharTodosReports();

      expect(result).toEqual(listaReports);
      expect(prisma.reportsDenuncia.findMany).toHaveBeenCalled();
    });
  });

  describe('deletarReport', () => {
    it('deve deletar um report se ele existir', async () => {
      prisma.reportsDenuncia.findUnique.mockResolvedValue(mockReport);
      prisma.reportsDenuncia.delete.mockResolvedValue(mockReport);

      const result = await service.deletarReport(1);

      expect(prisma.reportsDenuncia.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.reportsDenuncia.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockReport);
    });

    it('deve lançar Error se o report não for encontrado', async () => {
      prisma.reportsDenuncia.findUnique.mockResolvedValue(null);


      await expect(service.deletarReport(99)).rejects.toThrow('report não encontrado');
      
      expect(prisma.reportsDenuncia.delete).not.toHaveBeenCalled();
    });
  });
});