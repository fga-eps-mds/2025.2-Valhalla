// noticias.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NoticiasService } from './noticias.service';
import { PrismaService } from 'src/database/prisma.service';
import { TipoUsuario } from '@prisma/client';

// 1. Definição do Mock do Prisma

const prismaServiceMock = {
    noticia: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
    $transaction: jest.fn().mockImplementation((data) => data),
    usuario: {
        findUnique: jest.fn(),
    },
};

describe('NoticiasService', () => {
    let service: NoticiasService;
    let prisma: typeof prismaServiceMock; 

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NoticiasService,
                { 
                    provide: PrismaService,
                    useValue: prismaServiceMock, 
                },
            ],
        }).compile();

        service = module.get<NoticiasService>(NoticiasService);
        prisma = prismaServiceMock; 
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('criarNoticia', () => {
        const mockNoticiaDto = {
            descricao: 'Descrição do Teste',
            tipo: 'NOTICIA',
            idUsuario: 99, 
        };
        const idUsuarioRequisitor = 1;

        it('deve criar uma notícia se o usuário for ADMIN', async () => {
            prisma.noticia.create.mockResolvedValue({ id: 1, ...mockNoticiaDto });

            const result = await service.criarNoticia(
                idUsuarioRequisitor,
                mockNoticiaDto as any, 
                'ADMIN' as any,
            );

            expect(prisma.noticia.create).toHaveBeenCalled();
            expect(result).toHaveProperty('id', 1);
        });
        
        it('deve criar uma notícia se o usuário for ADMINMASTER', async () => {
            prisma.noticia.create.mockResolvedValue({ id: 2, ...mockNoticiaDto });

            const result = await service.criarNoticia(
                idUsuarioRequisitor,
                mockNoticiaDto as any,
                'ADMINMASTER' as any, 
            );

            expect(prisma.noticia.create).toHaveBeenCalledTimes(1);
            expect(result).toHaveProperty('id', 2);
        });

        it('deve lançar ForbiddenException se o usuário for COMUM', async () => {
            await expect(
                service.criarNoticia(
                    idUsuarioRequisitor,
                    mockNoticiaDto as any,
                    'COMUM' as any, 
                ),
            ).rejects.toThrow('Apenas administradores podem criar notícias.');
            expect(prisma.noticia.create).not.toHaveBeenCalled();
        });
    });
    describe('editarNoticia e DefinirHierarquia', () => {
        const idNoticia = 100;
        const idUsuarioDono = 5;
        const idUsuarioAdmin = 10;
        const mockDataEdicao = { descricao: 'Nova Descrição' };

        const mockNoticiaExistente = { 
            id: idNoticia, 
            idUsuario: idUsuarioDono, 
            usuario: { 
                id: idUsuarioDono, 
                tipo: 'COMUM' as any 
            }
        };

        const mockNoticiaEditada = { ...mockNoticiaExistente, ...mockDataEdicao };

        it('deve permitir a edição se o requisitor for o dono da notícia', async () => {
            prisma.noticia.findUnique.mockResolvedValue(mockNoticiaExistente as any);
            prisma.noticia.update.mockResolvedValue(mockNoticiaEditada as any);

            const result = await service.editarNoticia(
                idNoticia, 
                idUsuarioDono, 
                mockDataEdicao as any, 
                'COMUM' as any
            );

            expect(prisma.noticia.update).toHaveBeenCalledWith({
                where: { id: idNoticia },
                data: mockDataEdicao,
            });
            expect(result.descricao).toBe('Nova Descrição');
        });

        it('deve permitir que ADMINMASTER edite qualquer notícia', async () => {
            
            prisma.noticia.findUnique.mockResolvedValue(mockNoticiaExistente as any);
            prisma.noticia.update.mockResolvedValue(mockNoticiaEditada as any);
            
            
            const result = await service.editarNoticia(
                idNoticia, 
                idUsuarioAdmin, 
                mockDataEdicao as any, 
                'ADMINMASTER' as any 
            );

            
            expect(prisma.noticia.update).toHaveBeenCalledTimes(1);
            expect(result).toHaveProperty('id', idNoticia);
        });
        
        
        it('deve lançar ForbiddenException se um usuário COMUM tentar editar a notícia de outro', async () => {
            prisma.noticia.findUnique.mockResolvedValue(mockNoticiaExistente as any);
            
            
            await expect(
                service.editarNoticia(
                    idNoticia, 
                    idUsuarioAdmin, 
                    mockDataEdicao as any, 
                    'COMUM' as any 
                )
            ).rejects.toThrow('Ação não autorizada!');

            
            expect(prisma.noticia.update).not.toHaveBeenCalled();
        });
        
        
        it('deve lançar NotFoundException se a notícia não existir', async () => {
            
            prisma.noticia.findUnique.mockResolvedValue(null);
            
            
            await expect(
                service.editarNoticia(
                    idNoticia, 
                    idUsuarioDono, 
                    mockDataEdicao as any, 
                    'ADMINMASTER' as any
                )
            ).rejects.toThrow('Notícia não encontrada!');

          
            expect(prisma.noticia.update).not.toHaveBeenCalled();
        });
    });
    // src/noticias/noticias.service.spec.ts

    describe('desativarNoticia e deletarNoticia', () => {
        const idNoticia = 200;
        const idUsuarioDono = 5;
        const idUsuarioAdmin = 10;
        const mockNoticiaExistente = { id: idNoticia, idUsuario: idUsuarioDono, dataDelete: null };

        it('deve permitir que ADMINMASTER delete permanentemente uma notícia', async () => {
            prisma.noticia.findUnique.mockResolvedValue(mockNoticiaExistente as any);
            prisma.noticia.delete.mockResolvedValue(mockNoticiaExistente as any);

            await service.deletarNoticia(
                idNoticia, 
                idUsuarioAdmin, 
                'ADMINMASTER' as any
            );

            expect(prisma.noticia.delete).toHaveBeenCalledWith({
                where: { id: idNoticia },
            });
        });

        it('deve lançar ForbiddenException se um usuário COMUM tentar o hard delete', async () => {
            prisma.noticia.findUnique.mockResolvedValue(mockNoticiaExistente as any);

            await expect(
                service.deletarNoticia(
                    idNoticia, 
                    idUsuarioDono, 
                    'COMUM' as any
                )
            ).rejects.toThrow('Você não tem permissão para deletar permanentemente esta notícia.');

            expect(prisma.noticia.delete).not.toHaveBeenCalled();
        });

        it('deve permitir a desativação se o requisitor for o dono da notícia (soft delete)', async () => {
            prisma.noticia.findUnique.mockResolvedValue(mockNoticiaExistente as any);
            prisma.noticia.update.mockResolvedValue({ ...mockNoticiaExistente, dataDelete: new Date() } as any);

            await service.desativarNoticia(
                idNoticia, 
                idUsuarioDono, 
                'COMUM' as any
            );

            expect(prisma.noticia.update).toHaveBeenCalledWith({
                where: { id: idNoticia },
                data: { dataDelete: expect.any(Date) },
            });
        });

        it('deve lançar NotFoundException se a notícia a ser deletada/desativada não existir', async () => {
            prisma.noticia.findUnique.mockResolvedValue(null);

            await expect(
                service.deletarNoticia(idNoticia, idUsuarioAdmin, 'ADMINMASTER' as any)
            ).rejects.toThrow('Notícia com ID 200 não encontrada.');
            
             await expect(
                service.desativarNoticia(idNoticia, idUsuarioAdmin, 'ADMINMASTER' as any)
            ).rejects.toThrow('Notícia com ID 200 não encontrada.');
        });
    });

});