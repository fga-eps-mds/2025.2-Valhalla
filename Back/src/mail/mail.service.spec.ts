// Importações necessárias para o ambiente NestJS e Jest
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail.service'; // O serviço que queremos testar

// 1. Definição dos Mocks
const mockMailerService = { 
    sendMail: jest.fn().mockResolvedValue(true) 
}; [cite: 298]

const mockConfigService = { 
    get: jest.fn((key) => { 
        if (key === 'FRONT_URL') return 'http://teste.com'; // O valor que simulamos
        return null; 
    }), 
}; [cite: 299]

const mockUser = { 
    email: 'teste@unb.br', 
    nome: 'Teste' 
}; [cite: 300]
const token = 'mockToken123';
const expectedResetUrl = `http://teste.com/redefinit-senha?token=${token}`; // URL esperada [cite: 309]

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    // 2. Configuração do Módulo de Teste (setup)
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        // Substituímos os serviços reais pelas nossas versões Mock
        { provide: MailerService, useValue: mockMailerService }, 
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    jest.clearAllMocks(); // Limpa chamadas entre testes, garantindo que um teste não influencie o outro
  });

  // 3. Grupo de Testes
  describe('sendPasswordResetEmail(user, token)', () => { [cite: 302]

    // 4. Cenário de Sucesso (Teste de Ação)
    it('[Sucesso] Envio de E-mail: deve chamar mailerService.sendMail uma vez', async () => { [cite: 303, 305]
      // Ação: Chamar o método a ser testado
      await service.sendPasswordResetEmail(mockUser as any, token);

      // Expectativa (O que esperamos?): O método mockado deve ter sido chamado 1 vez.
      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);
    });

    // 5. Cenário de Integridade (Teste de Parâmetros)
    it('[Integridade] Parâmetros do E-mail: deve conter o email e a URL de reset corretos', async () => { [cite: 306, 307]
      await service.sendPasswordResetEmail(mockUser as any, token);

      // Pega o objeto de argumento com o qual sendMail foi chamado
      const sendMailArgs = mockMailerService.sendMail.mock.calls[0][0];

      // Verifica se o destinatário está correto [cite: 308]
      expect(sendMailArgs.to).toBe(mockUser.email);
      
      // Verifica se a URL de redefinição de senha está presente no HTML [cite: 309]
      expect(sendMailArgs.html).toContain(expectedResetUrl);

      // Verifica se o ConfigService foi chamado para obter a URL do Front [cite: 311]
      expect(mockConfigService.get).toHaveBeenCalledWith('FRONT_URL');
    });
  });
});