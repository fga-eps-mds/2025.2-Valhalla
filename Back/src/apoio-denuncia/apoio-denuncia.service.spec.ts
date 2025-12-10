import { Test, TestingModule } from '@nestjs/testing';
import { ApoioDenunciaService } from './apoio-denuncia.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

// Mock
const mockPrismaService = {
  denuncia: {
    findUnique: jest.fn(), 
  },
  apoiosDenuncia: {
    findUnique: jest.fn(), 
    create: jest.fn(),    
    delete: jest.fn(),     
    count: jest.fn(),  
  },
};

describe('Testes do Serviço de Apoio à Denúncia', () => {
  let service: ApoioDenunciaService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    // zera o contador de chamadas das funções
    jest.clearAllMocks();

    // módulo de teste 
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApoioDenunciaService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, 
        },
      ],
    }).compile();

    service = module.get<ApoioDenunciaService>(ApoioDenunciaService);
    prisma = module.get(PrismaService);
  });

  // Teste simples para verificar se o serviço subiu
  it('O serviço deve estar definido e rodando', () => {
    expect(service).toBeDefined();
  });
// Testes função alternar (apoiar / desapoiar)
  describe('Função: alternarApoio', () => {
    const dadosExemplo = { idUsuario: 1, idDenuncia: 10 };

    it('Deve dar erro se tentar apoiar uma denúncia que não existe', async () => {
      // Procura essa denúncia ID 10 e retorna null"
      prisma.denuncia.findUnique.mockResolvedValue(null);

      // Tenta rodar a função e espera que ela EXPLODA com um erro NotFoundException
      await expect(service.alternarApoio(dadosExemplo))
        .rejects
        .toThrow(NotFoundException);
      
      // Garante que o sistema parou
      expect(prisma.apoiosDenuncia.findUnique).not.toHaveBeenCalled();
        });
        it('Deve ADICIONAR um apoio se o usuário ainda não tiver apoiado', async () => {
      // A denúncia existe? Sim (retorna objeto com ID 10)
      prisma.denuncia.findUnique.mockResolvedValue({ id: 10 } as any); 
      
      // O usuário já apoiou? Não (retorna null)
      prisma.apoiosDenuncia.findUnique.mockResolvedValue(null);
      
      // Configura o retorno falso da criação (só pra não dar erro)
      prisma.apoiosDenuncia.create.mockResolvedValue({ id: 1, ...dadosExemplo } as any);

      const resultado = await service.alternarApoio(dadosExemplo);

      // O Prisma chamou a função .create()?
      expect(prisma.apoiosDenuncia.create).toHaveBeenCalledWith({
        data: dadosExemplo,
      });

      // A mensagem de retorno está certa?
      expect(resultado).toEqual({ 
        status: 'adicionado', 
        mensagem: 'Apoio registrado.' 
      });
    });
    it('Deve REMOVER o apoio se o usuário já tiver apoiado antes', async () => {
      // A denúncia existe? Sim.
      prisma.denuncia.findUnique.mockResolvedValue({ id: 10 } as any);
      
      // O usuário já apoiou? Sim (retorna um apoio existente com ID 5)
      prisma.apoiosDenuncia.findUnique.mockResolvedValue({ id: 5, ...dadosExemplo } as any);
      
      // Simula a deleção retornando o objeto deletado
      prisma.apoiosDenuncia.delete.mockResolvedValue({ id: 5, ...dadosExemplo } as any);

      const resultado = await service.alternarApoio(dadosExemplo);

      // O Prisma chamou a função .delete() no ID 5?
      expect(prisma.apoiosDenuncia.delete).toHaveBeenCalledWith({
        where: { id: 5 },
      });

      // A mensagem de retorno diz que removeu?
      expect(resultado).toEqual({ 
        status: 'removido', 
        mensagem: 'Apoio removido.' 
      });
    });
   });
   // Testes de contagem de apoio
  describe('Função: contarApoios', () => {
    it('Deve retornar o número total de apoios corretamente', async () => {
      // O banco diz que tem 42 apoios
      const totalEsperado = 42;
      prisma.apoiosDenuncia.count.mockResolvedValue(totalEsperado);

      const resultado = await service.contarApoios(10); // ID da denúncia 10

      expect(prisma.apoiosDenuncia.count).toHaveBeenCalledWith({
        where: { idDenuncia: 10 },
      });
      expect(resultado).toEqual({ idDenuncia: 10, total: totalEsperado });
    });
  });
  // Testes de status do apoio
  describe('Função: verificarSeUsuarioApoiou', () => {
    const idUsuario = 1;
    const idDenuncia = 10;

    it('Deve retornar TRUE se achar um apoio no banco', async () => {
      // O banco achou um apoio
      prisma.apoiosDenuncia.findUnique.mockResolvedValue({ id: 5, idUsuario, idDenuncia });

      const resultado = await service.verificarSeUsuarioApoiou(idUsuario, idDenuncia);

      expect(resultado).toEqual({ apoiado: true });
    });

    it('Deve retornar FALSE se não achar nada no banco', async () => {
      // O banco não achou nada (null)
      prisma.apoiosDenuncia.findUnique.mockResolvedValue(null);

      const resultado = await service.verificarSeUsuarioApoiou(idUsuario, idDenuncia);

      expect(resultado).toEqual({ apoiado: false });
    });
  });
});