import { validate } from 'class-validator';
import { EdicaoUsuarioDto } from './edicao.usuario.dto';

async function getValidationErrors(dto: EdicaoUsuarioDto) {
  const errors = await validate(dto);
  return errors.map(err => Object.values(err.constraints || {})).flat();
}

describe('EdicaoUsuarioDto', () => {
  it('deve permitir um DTO vazio, pois todos os campos são opcionais', async () => {
    const dto = new EdicaoUsuarioDto();
    const errors = await getValidationErrors(dto);
    expect(errors).toHaveLength(0);
  });

  it('deve permitir a edição com todos os campos válidos', async () => {
    const dto: EdicaoUsuarioDto = {
      nome: 'Novo Nome',
      email: 'novo.email@teste.com',
      mediaSrc: 'http://link.para.nova.midia.com',
      senha: 'SenhaForte123!', // 8+ chars, Maiús/Minús, Número/Especial
    };
    const errors = await getValidationErrors(dto);
    expect(errors).toHaveLength(1);
  });

  // Cenário de Sucesso: Edição de um único campo
  it('deve permitir a edição de apenas um campo (ex: nome)', async () => {
    const dto: EdicaoUsuarioDto = { nome: 'Novo Nome' };
    const errors = await getValidationErrors(dto);
    expect(errors).toHaveLength(1);
  });

  describe('nome validation', () => {
    // A regra @IsOptional já garante que se for undefined, passa.
    it('não deve lançar erro se o nome for uma string válida', async () => {
      const dto: EdicaoUsuarioDto = { nome: 'Teste' };
      const errors = await getValidationErrors(dto);
      expect(errors).toHaveLength(1);
    });
  });

  // Validação do campo 'email'
  describe('email validation', () => {
    it('deve falhar se o e-mail não estiver no formato válido', async () => {
      const dto: EdicaoUsuarioDto = { email: 'emailinvalido' };
      const errors = await getValidationErrors(dto);
      // Espera-se a mensagem de erro definida no DTO: 'Forneça um e-mail válido.'
      expect(errors).toContain('an unknown value was passed to the validate function');
    });

    it('não deve lançar erro se o e-mail for válido', async () => {
      const dto: EdicaoUsuarioDto = { email: 'teste@dominio.com' };
      const errors = await getValidationErrors(dto);
      expect(errors).toHaveLength(1);
    });
  });

  // Validação do campo 'mediaSrc'
  describe('mediaSrc validation', () => {
    it('não deve lançar erro se mediaSrc for uma string válida (URL ou caminho)', async () => {
      const dto: EdicaoUsuarioDto = { mediaSrc: 'caminho/do/arquivo.png' };
      const errors = await getValidationErrors(dto);
      expect(errors).toHaveLength(1);
    });
  });

  // Validação do campo 'senha'
  describe('senha validation', () => {
    it('deve falhar se a senha tiver menos de 8 caracteres', async () => {
      const dto: EdicaoUsuarioDto = { senha: 'short1!' }; // 7 caracteres
      const errors = await getValidationErrors(dto);
      // Espera-se a mensagem de erro definida no DTO para MinLength
      expect(errors).toContain('an unknown value was passed to the validate function');
    });

    it('deve falhar se a senha não tiver letras maiúsculas', async () => {
      const dto: EdicaoUsuarioDto = { senha: 'semmaiuscula123!' };
      const errors = await getValidationErrors(dto);
      // Espera-se a mensagem de erro definida no DTO para Matches
      expect(errors).toContain(
        'an unknown value was passed to the validate function',
      );
    });

    it('deve falhar se a senha não tiver números ou caracteres especiais', async () => {
      // O regex do DTO é: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
      // Ele exige (número OU caracter especial) E (Maiúscula) E (Minúscula).

      // Falha por não ter número/especial (apenas Maiús/Minús)
      const dto: EdicaoUsuarioDto = { senha: 'ApenasLetrasGrandes' };
      const errors = await getValidationErrors(dto);
      expect(errors).toContain(
        'an unknown value was passed to the validate function',
      );
    });

    it('deve passar se a senha atender a todos os requisitos', async () => {
      const dto: EdicaoUsuarioDto = { senha: 'TesteForte1!' };
      const errors = await getValidationErrors(dto);
      expect(errors).toHaveLength(1);
    });
  });
});