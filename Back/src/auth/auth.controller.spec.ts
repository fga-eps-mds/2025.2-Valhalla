import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            mudarSenha: jest.fn(),
            esqueciSenha: jest.fn(),
            resetSenha: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('deve chamar authService.login com o usuário da requisição', async () => {
      // Cenário
      const reqMock = { user: { email: 'teste@teste.com' } };
      const resultadoEsperado = { access_token: 'token123' };
      
      // Simulação
      jest.spyOn(authService, 'login').mockReturnValue(resultadoEsperado as any);

      // Execução
      const result = controller.login(reqMock as any);

      // Verificação
      expect(result).toEqual(resultadoEsperado);
      expect(authService.login).toHaveBeenCalledWith(reqMock.user);
    });
  });

  describe('mudarSenha', () => {
    it('deve chamar authService.mudarSenha com os parâmetros corretos', async () => {
      const reqMock = { user: { id: 1 } };
      const bodyMock = { senhaAntiga: 'old', senhaNova: 'new' };
      
      await controller.mudarSenha(reqMock, bodyMock);

      expect(authService.mudarSenha).toHaveBeenCalledWith(1, 'old', 'new');
    });
  });

  describe('esqueciSenha', () => {
    it('deve chamar authService.esqueciSenha', async () => {
      const bodyMock = { email: 'teste@teste.com' };
      
      await controller.esqueciSenha(bodyMock);

      expect(authService.esqueciSenha).toHaveBeenCalledWith('teste@teste.com');
    });
  });

  describe('resetPassword', () => {
    it('deve chamar authService.resetSenha', async () => {
      const bodyMock = { token: 'token123', novaSenha: 'nova' };
      
      await controller.resetPassword(bodyMock);

      expect(authService.resetSenha).toHaveBeenCalledWith('token123', 'nova');
    });
  });
});