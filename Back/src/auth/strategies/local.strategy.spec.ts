import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  const mockUser = {
    id: 1,
    email: 'teste@unb.br',
    nome: 'Teste Usuario',
    tipo: 'COMUM',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('deve inicializar com campos de usuário configurados como email e senha', () => {
      expect(strategy).toBeDefined();
    });

    it('deve configurar usernameField como email', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          LocalStrategy,
          {
            provide: AuthService,
            useValue: {
              validateUser: jest.fn(),
            },
          },
        ],
      }).compile();

      const newStrategy = module.get<LocalStrategy>(LocalStrategy);
      expect(newStrategy).toBeDefined();
    });
  });

  describe('validate', () => {
    it('deve retornar usuário quando credenciais são válidas', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser as any);

      const result = await strategy.validate('teste@unb.br', 'senha123');

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith('teste@unb.br', 'senha123');
    });

    it('deve lançar erro quando usuário é null', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      try {
        await strategy.validate('naoexiste@unb.br', 'senha123');
        fail('Deveria ter lançado um erro');
      } catch (error) {
        expect(error.message).toContain('Usuário ou senha inválidos');
      }
    });

    it('deve lançar erro quando usuário não existe', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      try {
        await strategy.validate('invalido@unb.br', 'wrongpassword');
        fail('Deveria ter lançado um erro');
      } catch (error) {
        expect(error.message).toContain('Usuário ou senha inválidos');
      }
    });

    it('deve passar email como username parameter', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser as any);

      await strategy.validate('teste@unb.br', 'senha123');

      expect(authService.validateUser).toHaveBeenCalledWith('teste@unb.br', expect.anything());
    });

    it('deve passar senha como password parameter', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser as any);

      await strategy.validate('teste@unb.br', 'minhasenha');

      expect(authService.validateUser).toHaveBeenCalledWith(expect.anything(), 'minhasenha');
    });

    it('deve retornar usuário com id quando credenciais são corretas', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser as any);

      const result = await strategy.validate('teste@unb.br', 'senha123');

      expect(result).toHaveProperty('id');
      expect(result.id).toBe(1);
    });

    it('deve retornar usuário com email quando credenciais são corretas', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser as any);

      const result = await strategy.validate('teste@unb.br', 'senha123');

      expect(result).toHaveProperty('email');
      expect(result.email).toBe('teste@unb.br');
    });

    it('deve lançar erro de tipo correto', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      try {
        await strategy.validate('user@unb.br', 'pass');
        fail('Deveria ter lançado um erro');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('deve chamar validateUser uma única vez por validação', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser as any);

      await strategy.validate('teste@unb.br', 'senha123');

      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });
  });
});
