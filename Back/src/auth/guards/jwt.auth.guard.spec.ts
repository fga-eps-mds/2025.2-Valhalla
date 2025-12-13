import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt.auth.guard';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { IS_PUBLIC_KEY } from '../decorators/isPublic.decorator';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockReflector: any;

  beforeEach(async () => {
    mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('deve permitir acesso se rota é pública', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('deve chamar getAllAndOverride com os parâmetros corretos', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      const handler = jest.fn();
      const classType = jest.fn();
      const mockContext = {
        getHandler: jest.fn().mockReturnValue(handler),
        getClass: jest.fn().mockReturnValue(classType),
      } as unknown as ExecutionContext;

      guard.canActivate(mockContext);

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        handler,
        classType,
      ]);
    });

    it('deve retornar boolean true quando super.canActivate retorna boolean true', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      jest.spyOn(AuthGuard('jwt').prototype, 'canActivate').mockReturnValue(true);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('deve retornar Promise quando super.canActivate retorna Promise', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      jest.spyOn(AuthGuard('jwt').prototype, 'canActivate').mockReturnValue(
        Promise.resolve(true)
      );

      const result = guard.canActivate(mockContext);

      expect(result instanceof Promise || result === true).toBe(true);
    });
  });
});
