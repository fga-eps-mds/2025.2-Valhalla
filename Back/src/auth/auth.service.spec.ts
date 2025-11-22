import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Usuario } from '@prisma/client';

// --- MOCKS ---
const mockUsuario = {
  id: 1,
  nome: 'Teste',
  email: 'teste@unb.br',
  senha: 'hashed_password',
  tipo: 'COMUM',
  mediaSrc: null,
} as Usuario;

const mockUsuarioService = {
  procurarPorEmail: jest.fn(),
  encontrarUsuarioAuth: jest.fn(),
  editarUsuario: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('token_jwt_assinado'),
  verify: jest.fn(),
};

const mockMailService = {
  sendPasswordResetEmail: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('segredo_teste'),
};

describe('AuthService', () => {
  let service: AuthService;
  let usuarioService: typeof mockUsuarioService;
  let jwtService: typeof mockJwtService;
  let mailService: typeof mockMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usuarioService = module.get(UsuarioService);
    jwtService = module.get(JwtService);
    mailService = module.get(MailService);
    
    jest.clearAllMocks();
    
    // Mock do Bcrypt para evitar processamento real
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('novo_hash'));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  // --- VALIDATE USER ---
  describe('validateUser', () => {
    it('deve validar usuário com credenciais corretas', async () => {
      usuarioService.procurarPorEmail.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('teste@unb.br', '123');

      expect(result).toEqual(expect.objectContaining({ email: 'teste@unb.br' }));
      expect(result).not.toHaveProperty('senha'); // Garante que removeu a senha
    });

    it('deve retornar null se senha estiver incorreta', async () => {
      usuarioService.procurarPorEmail.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('teste@unb.br', 'senha_errada');
      expect(result).toBeNull();
    });

    it('deve retornar null se usuário não existir', async () => {
      usuarioService.procurarPorEmail.mockResolvedValue(null);
      const result = await service.validateUser('inexistente@unb.br', '123');
      expect(result).toBeNull();
    });
  });

  // --- LOGIN ---
  describe('login', () => {
    it('deve retornar o objeto de token formatado', () => {
      const result = service.login(mockUsuario);

      expect(result).toHaveProperty('access_token', 'token_jwt_assinado');
      expect(result.user).toHaveProperty('email', mockUsuario.email);
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  // --- MUDAR SENHA ---
  describe('mudarSenha', () => {
    it('deve alterar a senha com sucesso', async () => {
      usuarioService.encontrarUsuarioAuth.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Senha antiga ok

      await service.mudarSenha(1, 'senha_antiga', 'senha_nova');

      expect(bcrypt.hash).toHaveBeenCalledWith('senha_nova', 10);
      expect(usuarioService.editarUsuario).toHaveBeenCalledWith(1, expect.objectContaining({ senha: 'novo_hash' }));
    });

    it('deve lançar NotFoundException se usuário não existir', async () => {
      usuarioService.encontrarUsuarioAuth.mockResolvedValue(null);
      await expect(service.mudarSenha(1, 'a', 'b')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar UnauthorizedException se senha antiga estiver errada', async () => {
      usuarioService.encontrarUsuarioAuth.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Senha errada

      await expect(service.mudarSenha(1, 'errada', 'nova')).rejects.toThrow(UnauthorizedException);
    });
  });

  // --- ESQUECI SENHA ---
  describe('esqueciSenha', () => {
    it('deve enviar email se usuário existir', async () => {
      usuarioService.procurarPorEmail.mockResolvedValue(mockUsuario);

      await service.esqueciSenha('teste@unb.br');

      expect(mailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('deve retornar mensagem de sucesso mesmo se usuário não existir (Segurança)', async () => {
      usuarioService.procurarPorEmail.mockResolvedValue(null);

      const result = await service.esqueciSenha('naoexiste@unb.br');
      
      expect(mailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(result.message).toContain('link de redefinição será enviado');
    });

    it('deve lançar BadRequestException se o envio de email falhar', async () => {
      usuarioService.procurarPorEmail.mockResolvedValue(mockUsuario);
      mailService.sendPasswordResetEmail.mockRejectedValue(new Error('Erro SMTP'));

      await expect(service.esqueciSenha('teste@unb.br')).rejects.toThrow(BadRequestException);
    });
  });

  // --- RESET SENHA ---
  describe('resetSenha', () => {
    it('deve redefinir a senha com token válido', async () => {
      jwtService.verify.mockReturnValue({ sub: 1 }); // Token decodificado
      
      await service.resetSenha('token_valido', 'nova_senha_reset');

      expect(bcrypt.hash).toHaveBeenCalledWith('nova_senha_reset', 10);
      expect(usuarioService.editarUsuario).toHaveBeenCalledWith(1, expect.objectContaining({ senha: 'novo_hash' }));
    });

    it('deve lançar ForbiddenException se token for inválido', async () => {
      jwtService.verify.mockImplementation(() => { throw new Error() });

      await expect(service.resetSenha('token_invalido', 'nova')).rejects.toThrow(ForbiddenException);
    });
  });
});