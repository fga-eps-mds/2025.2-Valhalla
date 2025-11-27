import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { MudarSenhaDto } from './dto/mudarSenha.dto';
import { esqueciSenhaDto } from './dto/esqueciSenha.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

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

  describe('login', () => {
    it('deve chamar login passando o usuário da request e o flag lembrar', async () => {
      const reqMock = { user: { id: 1, email: 'teste@teste.com' } };
      const loginDto: LoginDto = { email: 'teste@teste.com', senha: '123', lembrar: true };
      
      const resultadoEsperado = { access_token: 'token123', user: reqMock.user };
      jest.spyOn(authService, 'login').mockReturnValue(resultadoEsperado as any);

      const result = await controller.login(reqMock as any, loginDto);

      expect(result).toEqual(resultadoEsperado);
      expect(authService.login).toHaveBeenCalledWith(reqMock.user, true);
    });
  });

  describe('mudarSenha', () => {
    it('deve chamar mudarSenha com ID do usuário e dados do DTO', async () => {
      const reqMock = { user: { id: 1 } };
      const dto: MudarSenhaDto = { senhaAntiga: 'old', senhaNova: 'new123!' };
      
      await controller.mudarSenha(reqMock, dto);

      expect(authService.mudarSenha).toHaveBeenCalledWith(1, dto.senhaAntiga, dto.senhaNova);
    });
  });

  describe('esqueciSenha', () => {
    it('deve repassar o email do DTO para o service', async () => {
      const dto: esqueciSenhaDto = { email: 'teste@email.com' };
      
      await controller.esqueciSenha(dto);

      expect(authService.esqueciSenha).toHaveBeenCalledWith(dto.email);
    });
  });

  describe('resetPassword', () => {
    it('deve repassar token e nova senha para o service', async () => {
      const dto: ResetPasswordDto = { token: 'token-jwt', novaSenha: 'senhaNova123' };
      
      await controller.resetPassword(dto);

      expect(authService.resetSenha).toHaveBeenCalledWith(dto.token, dto.novaSenha);
    });
  });
});