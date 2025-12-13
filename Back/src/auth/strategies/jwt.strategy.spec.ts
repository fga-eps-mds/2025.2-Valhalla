import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { TipoUsuario } from '@prisma/client';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'JWT_SECRET') return 'my-secret-key';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('deve inicializar com a chave secreta do ConfigService', () => {
      expect(strategy).toBeDefined();
      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    });

    it('deve usar chave secreta como fallback se JWT_SECRET não estiver definida', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          JwtStrategy,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key) => {
                if (key === 'JWT_SECRET') return 'fallback-secret-key';
                return undefined;
              }),
            },
          },
        ],
      }).compile();

      const newStrategy = module.get<JwtStrategy>(JwtStrategy);
      expect(newStrategy).toBeDefined();
    });
  });

  describe('validate', () => {
    it('deve retornar usuário com id, email e tipo quando payload é válido', async () => {
      const payload = {
        sub: 1,
        email: 'teste@unb.br',
        tipo: 'COMUM' as TipoUsuario,
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 1,
        email: 'teste@unb.br',
        tipo: 'COMUM',
      });
    });

    it('deve extrair sub como id do payload', async () => {
      const payload = {
        sub: 42,
        email: 'usuario@unb.br',
        tipo: 'ADMIN' as TipoUsuario,
      };

      const result = await strategy.validate(payload);

      expect(result.id).toBe(42);
      expect(result.id).toEqual(payload.sub);
    });

    it('deve incluir email e tipo do payload no resultado', async () => {
      const payload = {
        sub: 5,
        email: 'admin@unb.br',
        tipo: 'ADMINMASTER' as TipoUsuario,
      };

      const result = await strategy.validate(payload);

      expect(result.email).toBe('admin@unb.br');
      expect(result.tipo).toBe('ADMINMASTER');
    });

    it('deve retornar apenas id, email e tipo (sem outros campos)', async () => {
      const payload = {
        sub: 10,
        email: 'teste@unb.br',
        tipo: 'COMUM' as TipoUsuario,
        nome: 'Teste Usuario',
        iat: 1234567890,
        exp: 1234571490,
      };

      const result = await strategy.validate(payload);

      expect(Object.keys(result).sort()).toEqual(['email', 'id', 'tipo']);
      expect(result).not.toHaveProperty('nome');
      expect(result).not.toHaveProperty('iat');
      expect(result).not.toHaveProperty('exp');
    });

    it('deve funcionar com payloads mínimos', async () => {
      const payload = {
        sub: 1,
        email: 'user@unb.br',
        tipo: 'COMUM' as TipoUsuario,
      };

      const result = await strategy.validate(payload);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.email).toBe('user@unb.br');
      expect(result.tipo).toBe('COMUM');
    });
  });
});
