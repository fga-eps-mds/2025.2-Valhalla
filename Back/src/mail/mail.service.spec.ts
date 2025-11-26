import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Usuario } from '@prisma/client';

// Mock do MailerService
const mockMailerService = {
  sendMail: jest.fn(),
};

// Mock do ConfigService
const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'FRONT_URL') return 'https://guardioes.unb.br';
    return null;
  }),
};

// Mock do Usuário
const mockUsuario = {
  email: 'teste@unb.br',
  nome: 'Teste',
} as Usuario;

describe('MailService', () => {
  let service: MailService;
  let mailerService: typeof mockMailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: mockMailerService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get(MailerService); // Não precisa tipar aqui se usar typeof acima
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('sendPasswordResetEmail', () => {
    it('deve chamar o sendMail com os parâmetros corretos e URL configurada', async () => {
      const token = 'token-123';
      
      await service.sendPasswordResetEmail(mockUsuario, token);

      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(mailerService.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: mockUsuario.email,
        subject: expect.stringContaining('Recuperação'),
        // Verifica se a URL do front (mockada) está no corpo do email
        html: expect.stringContaining('https://guardioes.unb.br/redefinir-senha?token=token-123'),
      }));
    });
  });
});