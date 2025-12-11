import { Test, TestingModule } from '@nestjs/testing';
import { NoticiasService } from './noticias.service';
import { PrismaService } from 'src/database/prisma.service';

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

    describe('editarNoticia', () => {
        const idNoticia = 150;
        const idUsuarioDono = 5;
        const mockNoticiaExistente = {
            id: idNoticia,
            idUsuario: idUsuarioDono,
            dataDelete: null,
            usuario: { id: idUsuarioDono, tipo: 'COMUM' }
        };
        const mockEdicaoDto = { descricao: 'Nova descrição' };

        it('deve permitir que o dono edite sua própria notícia', async () => {
            prisma.noticia.findUnique.mockResolvedValue(mockNoticiaExistente as any);
            prisma.noticia.update.mockResolvedValue({ ...mockNoticiaExistente, ...mockEdicaoDto } as any);

            await service.editarNoticia(idNoticia, idUsuarioDono, mockEdicaoDto as any, 'COMUM' as any);

            expect(prisma.noticia.update).toHaveBeenCalledWith({
                where: { id: idNoticia },
                data: mockEdicaoDto,
            });
        });

        it('deve permitir que ADMIN edite notícia de usuário COMUM', async () => {
            prisma.noticia.findUnique.mockResolvedValue(mockNoticiaExistente as any);
            prisma.noticia.update.mockResolvedValue({ ...mockNoticiaExistente, ...mockEdicaoDto } as any);

            await service.editarNoticia(idNoticia, 10, mockEdicaoDto as any, 'ADMIN' as any);

            expect(prisma.noticia.update).toHaveBeenCalled();
        });

        it('deve rejeitar edição de notícia quando usuário não tem permissão', async () => {
            const mockNoticiaAdminMaster = {
                id: idNoticia,
                idUsuario: 20,
                dataDelete: null,
                usuario: { id: 20, tipo: 'ADMINMASTER' }
            };
            prisma.noticia.findUnique.mockResolvedValue(mockNoticiaAdminMaster as any);

            await expect(
                service.editarNoticia(idNoticia, 10, mockEdicaoDto as any, 'ADMIN' as any)
            ).rejects.toThrow('Ação não autorizada!');
        });
    });

    describe('desativarNoticia e deletarNoticia', () => {
        const idNoticia = 200;
        const idUsuarioDono = 5;
        const idUsuarioAdmin = 10;

        // Mock correto com usuario incluso para evitar erro de leitura de 'id'
        const mockNoticiaExistente = {
            id: idNoticia,
            idUsuario: idUsuarioDono,
            dataDelete: null,
            usuario: { id: idUsuarioDono, tipo: 'COMUM' }
        };

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

        it('deve lançar ForbiddenException se um ADMIN tentar desativar notícia de outro ADMIN', async () => {
            const adminOwner = {
                id: idNoticia,
                idUsuario: 25,
                dataDelete: null,
                usuario: { id: 25, tipo: 'ADMIN' }
            };

            prisma.noticia.findUnique.mockResolvedValue(adminOwner as any);

            await expect(
                service.desativarNoticia(idNoticia, idUsuarioAdmin, 'ADMIN' as any)
            ).rejects.toThrow('Ação não autorizada!');
        });

        it('deve lançar ForbiddenException se um usuário COMUM tentar desativar notícia de outro', async () => {
            const anotherUserNoticia = {
                id: idNoticia,
                idUsuario: 99,
                dataDelete: null,
                usuario: { id: 99, tipo: 'COMUM' }
            };
            prisma.noticia.findUnique.mockResolvedValue(anotherUserNoticia as any);

            await expect(
                service.desativarNoticia(idNoticia, idUsuarioDono, 'COMUM' as any)
            ).rejects.toThrow('Ação não autorizada!');
        });

        it('deve lançar NotFoundException se a notícia a ser deletada/desativada não existir', async () => {
            prisma.noticia.findUnique.mockResolvedValue(null);

            // Ajustado mensagem de erro para bater com o service
            await expect(
                service.deletarNoticia(idNoticia, idUsuarioAdmin, 'ADMINMASTER' as any)
            ).rejects.toThrow('Notícia com ID 200 não encontrada.');

            await expect(
                service.desativarNoticia(idNoticia, idUsuarioAdmin, 'ADMINMASTER' as any)
            ).rejects.toThrow('Notícia não encontrada!');
        });
    });

    describe('Busca e Listagem (@Get methods)', () => {
        const idNoticiaExistente = 300;
        const idUsuario = 15;
        const noticiasMock = [
            { id: 300, descricao: 'Notícia A', idUsuario: idUsuario, dataDelete: null },
            { id: 301, descricao: 'Notícia B', idUsuario: idUsuario, dataDelete: null },
        ];
        const noticiaDeletada = { id: 302, descricao: 'Notícia C', idUsuario: idUsuario, dataDelete: new Date() };

        it('deve retornar a notícia se for encontrada e não estiver deletada', async () => {
            prisma.noticia.findUnique.mockResolvedValue(noticiasMock[0] as any);

            const result = await service.encontrarNoticia(idNoticiaExistente);

            expect(prisma.noticia.findUnique).toHaveBeenCalledWith({ where: { id: idNoticiaExistente } });
            expect(result).toEqual(noticiasMock[0]);
        });

        it('deve lançar NotFoundException se a notícia não for encontrada', async () => {
            prisma.noticia.findUnique.mockResolvedValue(null);

            await expect(service.encontrarNoticia(9999)).rejects.toThrow('Notícia não Encontrada!');
        });

        it('deve lançar NotFoundException se a notícia estiver soft deletada (dataDelete)', async () => {
            prisma.noticia.findUnique.mockResolvedValue(noticiaDeletada as any);

            await expect(service.encontrarNoticia(302)).rejects.toThrow('Notícia não Encontrada!');
        });

        it('deve listar notícias ativas e retornar dados de paginação corretos', async () => {
            const totalNoticias = 10;
            const page = 2;
            const limit = 5;
            const expectedSkip = 5;

            prisma.noticia.findMany.mockResolvedValue(noticiasMock as any);
            prisma.noticia.count.mockResolvedValue(totalNoticias);

            const result = await service.listarNoticias(page, limit);

            expect(prisma.noticia.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    skip: expectedSkip,
                    take: limit,
                    where: { dataDelete: null, usuario: { dataDelete: null } },
                })
            );

            expect(result.noticias.length).toBe(noticiasMock.length);
            expect(result.totalNoticias).toBe(totalNoticias);
        });

        it('deve listar notícias ativas por usuário usando transação', async () => {
            const totalNoticiasUsuario = noticiasMock.length;
            const page = 1;
            const limit = 10;

            prisma.$transaction.mockResolvedValue([noticiasMock, totalNoticiasUsuario]);
            const result = await service.listarNoticiasPorUsuario(idUsuario, page, limit);
            expect(prisma.$transaction).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ noticias: noticiasMock, totalNoticias: totalNoticiasUsuario });
        });
    });
});