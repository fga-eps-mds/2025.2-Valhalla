import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock do bcrypt
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

  // Mock do Usuário
  const mockUsuario = {
    id: 1,
    nome: 'Teste',
    email: 'teste@unb.br',
    senha: '$2b$10$hashedpassword',
    tipo: 'COMUM', 
    mediaSrc: 'avatar.jpg',
    cargo: 'ESTUDANTE',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuarioService,
          useValue: {
            procurarPorEmail: jest.fn(),
            encontrarUsuarioAuth: jest.fn(),
            editarUsuario: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token_assinado'),
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
            get: jest.fn((key) => {
              if (key === 'JWT_PASSWORD_RESET_SECRET') return 'segredo_reset';
              return 'segredo_jwt';
            }),
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

  // --- GRUPO: validateUser ---
  describe('validateUser', () => {
    it('deve validar e retornar usuário sem a senha quando credenciais estão corretas', async () => {
      jest.spyOn(usuarioService, 'procurarPorEmail').mockResolvedValue(mockUsuario as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('teste@unb.br', 'senha123');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result.senha).toBeUndefined();
    });

    it('deve retornar null se o usuário não existir', async () => {
      jest.spyOn(usuarioService, 'procurarPorEmail').mockResolvedValue(null);

      const result = await authService.validateUser('naoexiste@unb.br', 'senha123');

      expect(result).toBeNull();
    });

    it('deve retornar null se a senha estiver incorreta', async () => {
      jest.spyOn(usuarioService, 'procurarPorEmail').mockResolvedValue(mockUsuario as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser('teste@unb.br', 'senhaErrada');

      expect(result).toBeNull();
    });
  });

  // --- GRUPO: login ---
  describe('login', () => {
    it('deve gerar token com expiração de 6h (padrão)', async () => {
      const result = authService.login(mockUsuario as any, false);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({ sub: mockUsuario.id, email: mockUsuario.email }),
        expect.objectContaining({ expiresIn: '6h' })
      );
      expect(result).toHaveProperty('access_token', 'token_assinado');
      expect(result.user).toHaveProperty('id', mockUsuario.id);
    });

    it('deve gerar token com expiração de 90d se lembrar for true', async () => {
      authService.login(mockUsuario as any, true);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ expiresIn: '90d' })
      );
    });
  });

  // --- GRUPO: mudarSenha ---
  describe('mudarSenha', () => {
    it('deve trocar a senha com sucesso', async () => {
      jest.spyOn(usuarioService, 'encontrarUsuarioAuth').mockResolvedValue(mockUsuario as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('nova_senha_hash');

      await authService.mudarSenha(1, 'antiga', 'nova');

      // VERIFICAÇÃO COM 3 ARGUMENTOS
      expect(usuarioService.editarUsuario).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ senha: 'nova_senha_hash' }),
        expect.anything() // Aceita o { senha: true }
      );
    });

    it('deve lançar NotFoundException se usuário não encontrado', async () => {
      jest.spyOn(usuarioService, 'encontrarUsuarioAuth').mockResolvedValue(null as any);

      await expect(authService.mudarSenha(1, 'antiga', 'nova'))
        .rejects.toThrow(NotFoundException);
    });

    it('deve lançar UnauthorizedException se senha antiga incorreta', async () => {
      jest.spyOn(usuarioService, 'encontrarUsuarioAuth').mockResolvedValue(mockUsuario as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.mudarSenha(1, 'errada', 'nova'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  // --- GRUPO: esqueciSenha ---
  describe('esqueciSenha', () => {
    it('deve enviar email se usuário existir', async () => {
      jest.spyOn(usuarioService, 'procurarPorEmail').mockResolvedValue(mockUsuario as any);
      
      const result = await authService.esqueciSenha('teste@unb.br');

      expect(mailService.sendPasswordResetEmail).toHaveBeenCalled();
      expect(result.message).toContain('Se um utilizador com esse email existir');
    });

    it('não deve enviar email se usuário não existir, mas retornar mensagem segura', async () => {
      jest.spyOn(usuarioService, 'procurarPorEmail').mockResolvedValue(null);

      const result = await authService.esqueciSenha('naoexiste@unb.br');

      expect(mailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(result.message).toContain('Se um utilizador com esse email existir');
    });

    it('deve lançar BadRequestException se falhar o envio de email', async () => {
      jest.spyOn(usuarioService, 'procurarPorEmail').mockResolvedValue(mockUsuario as any);
      jest.spyOn(mailService, 'sendPasswordResetEmail').mockRejectedValue(new Error('Erro mail'));

      await expect(authService.esqueciSenha('teste@unb.br'))
        .rejects.toThrow(BadRequestException);
    });
  });

  // --- GRUPO: resetSenha ---
  describe('resetSenha', () => {
    it('deve redefinir a senha com token válido', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 1, email: 'teste@unb.br' });
      (bcrypt.hash as jest.Mock).mockResolvedValue('nova_hash_reset');

      await authService.resetSenha('token_valido', 'novasenha');

      // VERIFICAÇÃO COM 3 ARGUMENTOS
      expect(usuarioService.editarUsuario).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ senha: 'nova_hash_reset' }),
        expect.anything() // Aceita o { senha: true }
      );
    });

    it('deve lançar ForbiddenException com token inválido', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Token expirado');
      });

      await expect(authService.resetSenha('token_invalido', 'novasenha'))
        .rejects.toThrow(ForbiddenException);
    });
  });
});