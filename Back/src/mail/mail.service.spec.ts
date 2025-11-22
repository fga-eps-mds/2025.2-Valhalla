import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

// O TypeScript precisa saber o formato do Usuario, mas para o teste
// basta simularmos um objeto simples, já que não vamos salvar nada no banco.
const mockUsuario = {
  id: 1,
  email: 'usuario@teste.com',
  nome: 'Gustavo',
  // Adicione outros campos se o Prisma reclamar, mas geralmente isso basta
} as any;

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  // 1. Criamos o MOCK do MailerService
  // Isso impede que o sistema tente enviar email de verdade
  const mockMailerService = {
    sendMail: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          // Quando o MailService pedir o MailerService...
          provide: MailerService,
          // ... entregamos a versão mockada (falsa)
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
    
    // Limpa os registros do mock antes de cada teste
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve enviar o email de recuperação de senha com o token e link corretos', async () => {
    // ARRANGE (Preparar)
    const token = 'token-super-secreto-123';
    const expectedUrl = `http://localhost:3001/reset-password?token=${token}`;

    // ACT (Agir)
    await service.sendPasswordResetEmail(mockUsuario, token);

    // ASSERT (Verificar)
    // Verifica se a função sendMail foi chamada 1 vez
    expect(mailerService.sendMail).toHaveBeenCalledTimes(1);

    // Verifica se foi chamada com os argumentos certos
    expect(mailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: mockUsuario.email,
        subject: 'Recuperação de Senha',
        // Aqui vem a mágica: verificamos se o HTML contém o link correto
        html: expect.stringContaining(expectedUrl),
      }),
    );
    
    // Opcional: verificar se o nome do usuário foi inserido no HTML
    expect(mailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Gustavo'),
      }),
    );
  });
});