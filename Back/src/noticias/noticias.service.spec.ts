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

});