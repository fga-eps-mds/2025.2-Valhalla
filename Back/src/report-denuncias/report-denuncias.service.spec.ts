import { Test, TestingModule } from '@nestjs/testing';
import { ReportDenunciasService } from './report-denuncias.service';
import { PrismaService } from '../database/prisma.service';
import { reportDenunciasDto } from './dto/report-denuncias.dto';
import { NotFoundException } from '@nestjs/common';

// 1. Criamos um objeto falso para simular o que o Prisma retorna
// Ajustado para refletir os campos do novo DTO (idUsuario, idDenuncia)
const mockReport = {
  id: 1,
  idDenuncia: 10,
  idUsuario: 5,
  dataCriacao: new Date(),
};

// 2. Mockamos as funções do Prisma
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
    prisma = module.get(PrismaService); // Pega o mock injetado
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  // --- TESTE DE CRIAÇÃO ---
  describe('CriarReportDenuncia', () => {
    it('deve chamar o prisma.create com os dados corretos', async () => {
      // Ajustado para o novo formato do DTO
      const dto: reportDenunciasDto = { idUsuario: 5, idDenuncia: 10 };
      
      // Configura o mock para retornar sucesso
      prisma.reportsDenuncia.create.mockResolvedValue(mockReport);

      await service.CriarReportDenuncia(dto);

      // Verifica se o prisma foi chamado corretamente
      expect(prisma.reportsDenuncia.create).toHaveBeenCalledWith({ data: dto });
      // OBS: Não testamos o retorno aqui porque sua função original não tem 'return'
    });
  });

  // --- TESTE DE BUSCA ---
  describe('acharTodosReports', () => {
    it('deve retornar uma lista de reports', async () => {
      const listaReports = [mockReport, { ...mockReport, id: 2 }];
      prisma.reportsDenuncia.findMany.mockResolvedValue(listaReports);

      const result = await service.acharTodosReports();

      expect(result).toEqual(listaReports);
      expect(prisma.reportsDenuncia.findMany).toHaveBeenCalled();
    });
  });

  // --- TESTE DE DELEÇÃO ---
  describe('deletarReport', () => {
    it('deve deletar um report se ele existir', async () => {
      // 1. Simula que o findUnique encontrou algo
      prisma.reportsDenuncia.findUnique.mockResolvedValue(mockReport);
      // 2. Simula que o delete funcionou
      prisma.reportsDenuncia.delete.mockResolvedValue(mockReport);

      const result = await service.deletarReport(1);

      expect(prisma.reportsDenuncia.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.reportsDenuncia.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockReport);
    });

    it('deve lançar Error se o report não for encontrado', async () => {
      // 1. Simula que o findUnique retornou null (não achou)
      prisma.reportsDenuncia.findUnique.mockResolvedValue(null);

      // OBS: Estou testando 'Error' genérico porque é o que está no seu código.
      // Recomendo mudar para NotFoundException no código e aqui.
      await expect(service.deletarReport(99)).rejects.toThrow('report não encontrado');
      
      // Garante que NÃO tentou deletar
      expect(prisma.reportsDenuncia.delete).not.toHaveBeenCalled();
    });
  });
});