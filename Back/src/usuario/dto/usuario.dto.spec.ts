import { validate } from 'class-validator';
import { CriacaoUsuarioDto } from './usuario.dto'; 

// Substitua estes valores pelos seus ENUMs reais, se necessário.
enum CargoUsuario {
  ESTUDANTE = 'ESTUDANTE',
  PROFESSOR = 'PROFESSOR',
  OUTRO = 'OUTRO',
}

enum TipoUsuario {
  COMUM = 'COMUM',
  ADMIN = 'ADMIN',
  ADMINMASTER = 'ADMINMASTER',
}

// Função auxiliar para validar e obter os erros
async function getValidationErrors(dto: any) {
  const dtoInstance = new CriacaoUsuarioDto();
  Object.assign(dtoInstance, dto);
  const errors = await validate(dtoInstance);
  return errors.map(err => Object.values(err.constraints || {})).flat();
}

// DTO Base Válido para testes de sucesso
const validDto: CriacaoUsuarioDto = {
  nome: 'Usuário Teste',
  email: 'teste@exemplo.com',
  // Requisitos da senha: 8+ chars, sem espaço, Maiús/Minús, Número e Especial
  senha: 'SenhaForte123!',
  cargo: CargoUsuario.ESTUDANTE,
  // 'tipo' e 'mediaSrc' são opcionais, então são omitidos ou definidos.
};

describe('CriacaoUsuarioDto', () => {
  // Cenário de Sucesso Completo
  it('deve passar se todos os campos obrigatórios forem válidos', async () => {
    const errors = await getValidationErrors(validDto);
    expect(errors).toHaveLength(0);
  });

  it('deve passar se incluir os campos opcionais válidos', async () => {
    const dtoWithOptionals: CriacaoUsuarioDto = {
      ...validDto,
      tipo: TipoUsuario.ADMIN,
      mediaSrc: 'http://caminho.para.midia.png',
    };
    const errors = await getValidationErrors(dtoWithOptionals);
    expect(errors).toHaveLength(0);
  });

  // --- Testes de Obrigatoriedade (@IsNotEmpty) ---

  it('deve falhar se os campos obrigatórios estiverem vazios ou ausentes', async () => {
    const emptyDto = {}; // Nenhum campo fornecido
    const errors = await getValidationErrors(emptyDto);

    // Espera-se erros para: nome, email, senha, cargo
    expect(errors).toContain('O nome não pode estar vazio.');
    expect(errors).toContain('O e-mail não pode estar vazio.');
    expect(errors).toContain('a senha não pode ser vazia');
    // @IsNotEmpty no cargo falha silenciosamente se a chave não existir no objeto (dependendo do validador, mas é melhor verificar se falha na ausência)
    // Para Cargo e Tipo, a falha mais comum é no @IsEnum se o valor for inválido, mas aqui verificamos a ausência.
    // Como o cargo não é opcional e não tem mensagem de IsNotEmpty, vamos testar o que ele lança.

    // Teste de ausência do campo 'nome'
    const errorsNome = await getValidationErrors({ ...validDto, nome: undefined });
    expect(errorsNome).toContain('O nome não pode estar vazio.');

    // Teste de ausência do campo 'email'
    const errorsEmail = await getValidationErrors({ ...validDto, email: undefined });
    expect(errorsEmail).toContain('O e-mail não pode estar vazio.');

    // Teste de ausência do campo 'senha'
    const errorsSenha = await getValidationErrors({ ...validDto, senha: undefined });
    expect(errorsSenha).toContain('a senha não pode ser vazia');
  });

  // --- Testes de Formato Específicos ---

  describe('email validation', () => {
    it('deve falhar se o e-mail não estiver no formato válido', async () => {
      const dto = { ...validDto, email: 'email.invalido' };
      const errors = await getValidationErrors(dto);
      expect(errors).toContain('Forneça um e-mail válido.');
    });
  });

  describe('cargo validation', () => {
    it('deve falhar se o cargo for um valor que não está no enum CargoUsuario', async () => {
      const dto = { ...validDto, cargo: 'INVALIDO' }; // 'INVALIDO' não está no CargoUsuario
      const errors = await getValidationErrors(dto);
      // A mensagem de erro padrão de @IsEnum é esperada.
      expect(errors).toContain('O cargo fornecido é inválido.');
    });
  });

  describe('tipo validation (@IsEnum e @IsOptional)', () => {
    it('deve falhar se o tipo for um valor que não está no enum TipoUsuario', async () => {
      const dto = { ...validDto, tipo: 'INVALIDO' }; // 'INVALIDO' não está no TipoUsuario
      const errors = await getValidationErrors(dto);
      // A mensagem de erro padrão de @IsEnum é esperada.
      expect(errors).toContain('O tipo de usuário fornecido é inválido.');
    });
  });

  describe('mediaSrc validation (@IsString e @IsOptional)', () => {
    it('deve falhar se mediaSrc for fornecido mas não for uma string', async () => {
      const dto = { ...validDto, mediaSrc: 12345 as any };
      const errors = await getValidationErrors(dto);
      // Espera-se a mensagem padrão de @IsString
      expect(errors.some(err => err.includes('must be a string'))).toBe(true);
    });
  });

  // --- Testes de Senha (@MinLength, Sem Espaços, Complexidade) ---

  describe('senha complexity validation', () => {
    // [cite: 96] Requisito: Senha tem que ter no mínimo 8 caracteres
    it('deve falhar se a senha tiver menos de 8 caracteres', async () => {
      const dto = { ...validDto, senha: 'A1!a7' }; // 5 caracteres
      const errors = await getValidationErrors(dto);
      expect(errors).toContain('a senha tem que ter no mínimo 8 caracteres');
    });

    // [cite: 96] Requisito: A senha não pode conter espaços em branco
    it('deve falhar se a senha contiver espaços em branco', async () => {
      const dto = { ...validDto, senha: 'Senha Com Espaco1!' };
      const errors = await getValidationErrors(dto);
      expect(errors).toContain('A senha não pode conter espaços em branco ou quebras de linha.');
    });

    // [cite: 96] Requisito: Maiúsculas, minúsculas, números e caracteres especiais
    it('deve falhar se a senha não tiver letras maiúsculas', async () => {
      const dto = { ...validDto, senha: 'apenasminuscula1!' };
      const errors = await getValidationErrors(dto);
      expect(errors).toContain(
        'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.',
      );
    });

    it('deve falhar se a senha não tiver números ou caracteres especiais', async () => {
      const dto = { ...validDto, senha: 'ApenasLetrasAqui' };
      const errors = await getValidationErrors(dto);
      expect(errors).toContain(
        'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.',
      );
    });
  });
});