import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';//
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

// Mocks de Dados
const mockMailerService = { 
    sendMail: jest.fn().mockResolvedValue(true) 
};

const mockConfigService = { 
    get: jest.fn((key) => { 
        if (key === 'FRONT_URL') return 'http://teste.com';
        return null; 
    }), 
};

const mockUser = { 
    email: 'teste@unb.br', 
    nome: 'Teste' 
};
const token = 'mockToken123';
const expectedResetUrl = `http://teste.com/redefinit-senha?token=${token}`;

// --- Enviar email ---
describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: mockMailerService }, 
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    jest.clearAllMocks();
  });

// --- Recuperar senha ---
  describe('sendPasswordResetEmail(user, token)', () => {
    it('[Sucesso] Envio de E-mail: deve chamar mailerService.sendMail uma vez', async () => {
      await service.sendPasswordResetEmail(mockUser as any, token);

      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);
    });

    it('[Integridade] Parâmetros do E-mail: deve conter o email e a URL de reset corretos', async () => {
      await service.sendPasswordResetEmail(mockUser as any, token);

      const sendMailArgs = mockMailerService.sendMail.mock.calls[0][0];

      expect(sendMailArgs.to).toBe(mockUser.email);      
      expect(sendMailArgs.html).toContain(expectedResetUrl);
      expect(mockConfigService.get).toHaveBeenCalledWith('FRONT_URL');
    });

    it('[Integridade] HTML deve conter o nome do usuário', async () => {
      await service.sendPasswordResetEmail(mockUser as any, token);

      const sendMailArgs = mockMailerService.sendMail.mock.calls[0][0];
      
      expect(sendMailArgs.html).toContain(mockUser.nome);
    });

    it('[Integridade] Subject do e-mail deve estar correto', async () => {
      await service.sendPasswordResetEmail(mockUser as any, token);

      const sendMailArgs = mockMailerService.sendMail.mock.calls[0][0];
      
      expect(sendMailArgs.subject).toBe('Recuperação de Senha - Guardiões');
    });

    it('[Fallback] Deve usar localhost:3000 quando FRONT_URL não estiver definido', async () => {
      const mockConfigServiceWithoutUrl = {
        get: jest.fn((key) => {
          if (key === 'FRONT_URL') return null;
          return null;
        }),
      };

      const moduleWithFallback: TestingModule = await Test.createTestingModule({
        providers: [
          MailService,
          { provide: MailerService, useValue: mockMailerService },
          { provide: ConfigService, useValue: mockConfigServiceWithoutUrl },
        ],
      }).compile();

      const serviceWithFallback = moduleWithFallback.get<MailService>(MailService);
      jest.clearAllMocks();

      await serviceWithFallback.sendPasswordResetEmail(mockUser as any, token);

      const sendMailArgs = mockMailerService.sendMail.mock.calls[0][0];
      const fallbackUrl = `http://localhost:3000/redefinit-senha?token=${token}`;
      
      expect(sendMailArgs.html).toContain(fallbackUrl);
    });

    it('[Erro] Deve propagar erro quando mailerService.sendMail falha', async () => {
      const error = new Error('Erro ao enviar email');
      mockMailerService.sendMail.mockRejectedValueOnce(error);

      await expect(service.sendPasswordResetEmail(mockUser as any, token)).rejects.toThrow('Erro ao enviar email');
    });
  });
});