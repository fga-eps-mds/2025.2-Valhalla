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

});