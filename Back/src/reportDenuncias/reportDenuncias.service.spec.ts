import { Test, TestingModule } from '@nestjs/testing';
import { ReportDenunciasService } from './reportDenuncias.service';
import { PrismaService } from '../database/prisma.service';
import { reportDenunciasDto } from './dto/reportDenuncias.dto';
import { BadRequestException } from '@nestjs/common';

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

  // -------------------------------------------------------------------------
  // CriarReportDenuncia
  // -------------------------------------------------------------------------
  describe('CriarReportDenuncia', () => {
    const dto: reportDenunciasDto = { idUsuario: 5, idDenuncia: 10 };

    it('deve criar um report se não existir um report prévio', async () => {
      prisma.reportsDenuncia.findUnique.mockResolvedValue(null);
      prisma.reportsDenuncia.create.mockResolvedValue(mockReport);

      const result = await service.CriarReportDenuncia(dto);

      expect(prisma.reportsDenuncia.findUnique).toHaveBeenCalledWith({
        where: {
          idUsuario_idDenuncia: { idUsuario: dto.idUsuario, idDenuncia: dto.idDenuncia },
        },
      });
      expect(prisma.reportsDenuncia.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual({
        status: 'criado',
        mensagem: 'Report registrado.',
        id: mockReport.id,
      });
    });

    it('deve lançar BadRequestException se o usuário já reportou antes (linha 18)', async () => {
      prisma.reportsDenuncia.findUnique.mockResolvedValue(mockReport);

      await expect(service.CriarReportDenuncia(dto))
        .rejects
        .toThrow(new BadRequestException('Você já reportou esta denúncia.'));

      expect(prisma.reportsDenuncia.create).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se ocorrer erro P2002 (unique constraint) (linhas 25–28)', async () => {
      prisma.reportsDenuncia.findUnique.mockResolvedValue(null);

      prisma.reportsDenuncia.create.mockRejectedValue({
        code: 'P2002',
      });

      await expect(service.CriarReportDenuncia(dto))
        .rejects
        .toThrow(new BadRequestException('Você já reportou esta denúncia.'));

      expect(prisma.reportsDenuncia.create).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Listagem
  // -------------------------------------------------------------------------
  describe('acharTodosReports', () => {
    it('deve retornar uma lista de reports', async () => {
      const listaReports = [mockReport, { ...mockReport, id: 2 }];
      prisma.reportsDenuncia.findMany.mockResolvedValue(listaReports);

      const result = await service.acharTodosReports();

      expect(result).toEqual(listaReports);
      expect(prisma.reportsDenuncia.findMany).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // verificarSeUsuarioReportou
  // -------------------------------------------------------------------------
  describe('verificarSeUsuarioReportou', () => {
    it('deve retornar reportado: true quando o report existe (linhas 37–42)', async () => {
      prisma.reportsDenuncia.findUnique.mockResolvedValue(mockReport);

      const result = await service.verificarSeUsuarioReportou(5, 10);

      expect(prisma.reportsDenuncia.findUnique).toHaveBeenCalledWith({
        where: { idUsuario_idDenuncia: { idUsuario: 5, idDenuncia: 10 } },
      });
      expect(result).toEqual({ reportado: true });
    });

    it('deve retornar reportado: false quando não existe report', async () => {
      prisma.reportsDenuncia.findUnique.mockResolvedValue(null);

      const result = await service.verificarSeUsuarioReportou(5, 10);

      expect(result).toEqual({ reportado: false });
    });
  });

  // -------------------------------------------------------------------------
  // Deletar
  // -------------------------------------------------------------------------
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

      await expect(service.deletarReport(99))
        .rejects
        .toThrow('report não encontrado');
      
      expect(prisma.reportsDenuncia.delete).not.toHaveBeenCalled();
    });
  });
});