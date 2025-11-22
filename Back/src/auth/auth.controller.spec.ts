import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRequest } from './models/authRequest';
import { MudarSenhaDto } from './models/mudarSenha.dto';
import { esqueciSenhaDto } from './models/esqueciSenha.dto';
import { ResetPasswordDto } from './models/resetPassword.dto';

// Mock do AuthService
const mockAuthService = {
  login: jest.fn(),
  mudarSenha: jest.fn(),
  esqueciSenha: jest.fn(),
  resetSenha: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('deve chamar authService.login com o usuário do request', async () => {
      const req = { user: { id: 1, email: 'teste@unb.br' } } as AuthRequest;
      mockAuthService.login.mockReturnValue({ access_token: 'token' });

      const result = await controller.login(req);

      expect(service.login).toHaveBeenCalledWith(req.user);
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('mudarSenha', () => {
    it('deve extrair ID do usuário e chamar mudarSenha', async () => {
      const req = { user: { id: 1 } };
      const dto: MudarSenhaDto = { senhaAntiga: 'old', senhaNova: 'new' };

      await controller.mudarSenha(req, dto);

      expect(service.mudarSenha).toHaveBeenCalledWith(1, 'old', 'new');
    });
  });

  describe('esqueciSenha', () => {
    it('deve chamar service.esqueciSenha', async () => {
      const dto: esqueciSenhaDto = { email: 'teste@unb.br' };
      await controller.esqueciSenha(dto);
      expect(service.esqueciSenha).toHaveBeenCalledWith(dto.email);
    });
  });

  describe('resetPassword', () => {
    it('deve chamar service.resetSenha', async () => {
      const dto: ResetPasswordDto = { token: 'token123', novaSenha: 'new' };
      await controller.resetPassword(dto);
      expect(service.resetSenha).toHaveBeenCalledWith(dto.token, dto.novaSenha);
    });
  });
});