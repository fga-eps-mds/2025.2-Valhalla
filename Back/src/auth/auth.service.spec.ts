import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';


jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  
  let usuarioService: UsuarioService;
  let jwtService: JwtService;
  let mailService: MailService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,

        {
          provide: UsuarioService,
          useValue: {
            procurarPorEmail: jest.fn(),
            encontrarUsuario: jest.fn(),
            editarUsuario: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendPasswordResetEmail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('segredo-teste'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usuarioService = module.get<UsuarioService>(UsuarioService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(authService).toBeDefined();
  });


  describe('login', () => {
    it('deve retornar um objeto com access_token', async () => {
      const usuarioDtoMock = { id: 1, email: 'teste@teste.com', nome: 'Teste' };
      
      jest.spyOn(jwtService, 'sign').mockReturnValue('token-falso');

      const result = authService.login(usuarioDtoMock as any);

      expect(result).toEqual({ access_token: 'token-falso' });
      expect(jwtService.sign).toHaveBeenCalled(); 
    });
  });


  describe('validateUser', () => {
    it('deve validar o usuário corretamente', async () => {
      const usuarioMock = { id: 1, email: 'a@a.com', senha: 'hash_senha' };
      
      jest.spyOn(usuarioService, 'procurarPorEmail').mockResolvedValue(usuarioMock as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('a@a.com', '123456');

      expect(result).toHaveProperty('id');
      expect(result.senha).toBeUndefined();
    });

    it('deve lançar erro se usuário não existir', async () => {
      jest.spyOn(usuarioService, 'procurarPorEmail').mockResolvedValue(null);

      await expect(authService.validateUser('a@a.com', '123456'))
        .rejects.toThrow('email ou senha inválidas');
    });

    it('deve lançar erro se a senha estiver errada', async () => {
        const usuarioMock = { id: 1, email: 'a@a.com', senha: 'hash_senha' };
        jest.spyOn(usuarioService, 'procurarPorEmail').mockResolvedValue(usuarioMock as any);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
  
        await expect(authService.validateUser('a@a.com', 'senha_errada'))
          .rejects.toThrow('email ou senha inválidas');
      });
  });

  describe('mudarSenha', () => {
    it('deve mudar a senha com sucesso', async () => {
       const usuarioMock = { id: 1, senha: 'hash_antiga' };
       jest.spyOn(usuarioService, 'encontrarUsuario').mockResolvedValue(usuarioMock as any);
       (bcrypt.compare as jest.Mock).mockResolvedValue(true); 
       (bcrypt.hash as jest.Mock).mockResolvedValue('novo_hash'); 

       await authService.mudarSenha(1, 'antiga', 'nova');

       expect(usuarioService.editarUsuario).toHaveBeenCalledWith(1, expect.objectContaining({ senha: 'novo_hash' }));
    });

    it('deve lançar NotFoundException se usuário não existir', async () => {
        jest.spyOn(usuarioService, 'encontrarUsuario').mockResolvedValue(null);
        
        await expect(authService.mudarSenha(1, 'antiga', 'nova'))
            .rejects.toThrow(NotFoundException);
    });

    it('deve lançar UnauthorizedException se senha antiga for inválida', async () => {
        const usuarioMock = { id: 1, senha: 'hash_antiga' };
        jest.spyOn(usuarioService, 'encontrarUsuario').mockResolvedValue(usuarioMock as any);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Senha antiga errada

        await expect(authService.mudarSenha(1, 'errada', 'nova'))
            .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('esqueciSenha', () => {
      it('deve enviar email se usuário existir', async () => {
          const usuarioMock = { id: 1, email: 'test@test.com', nome: 'Test' };
          jest.spyOn(usuarioService, 'procurarPorEmail').mockResolvedValue(usuarioMock as any);
          jest.spyOn(jwtService, 'sign').mockReturnValue('token-reset');
          
          const result = await authService.esqueciSenha('test@test.com');

          expect(mailService.sendPasswordResetEmail).toHaveBeenCalledWith(usuarioMock, 'token-reset');
          expect(result.message).toContain('Se um utilizador com esse email existir');
      });

      it('não deve enviar email se usuário não existir, mas retornar mensagem segura', async () => {
        jest.spyOn(usuarioService, 'procurarPorEmail').mockResolvedValue(null);

        const result = await authService.esqueciSenha('naoexiste@test.com');

        expect(mailService.sendPasswordResetEmail).not.toHaveBeenCalled();
        expect(result.message).toContain('Se um utilizador com esse email existir');
      });
  });
});