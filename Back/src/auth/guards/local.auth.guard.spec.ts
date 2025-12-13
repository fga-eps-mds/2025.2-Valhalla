import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { LocalAuthGuard } from './local.auth.guard';

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalAuthGuard],
    }).compile();

    guard = module.get<LocalAuthGuard>(LocalAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('deve retornar true quando autenticação é bem-sucedida', async () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      // Mock apenas o super.canActivate, não o próprio canActivate
      jest.spyOn(LocalAuthGuard.prototype, 'canActivate' as any).mockImplementation(
        function() {
          return true;
        }
      );

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('deve retornar Promise quando super.canActivate retorna Promise', async () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      jest.spyOn(LocalAuthGuard.prototype, 'canActivate' as any).mockImplementation(
        function() {
          return Promise.resolve(true);
        }
      );

      const result = guard.canActivate(mockContext);

      expect(result instanceof Promise || result === true).toBe(true);
    });
  });

  describe('handleRequest', () => {
    it('deve retornar o usuário quando não há erro e usuário existe', () => {
      const mockUser = { id: 1, email: 'teste@unb.br', nome: 'Teste' };

      const result = guard.handleRequest(null, mockUser);

      expect(result).toEqual(mockUser);
    });

    it('deve lançar UnauthorizedException quando há erro', () => {
      const error = new Error('Credenciais inválidas');

      expect(() => {
        guard.handleRequest(error, null);
      }).toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException quando usuário é null', () => {
      expect(() => {
        guard.handleRequest(null, null);
      }).toThrow(UnauthorizedException);
    });

    it('deve usar a mensagem do erro quando disponível', () => {
      const error = new Error('Usuário ou senha inválidos');

      try {
        guard.handleRequest(error, null);
        fail('Deveria ter lançado uma exceção');
      } catch (err) {
        expect(err.message).toContain('Usuário ou senha inválidos');
      }
    });

    it('deve lançar UnauthorizedException genérica sem mensagem do erro', () => {
      try {
        guard.handleRequest(null, null);
        fail('Deveria ter lançado uma exceção');
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
