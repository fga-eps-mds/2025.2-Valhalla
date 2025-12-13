import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EdicaoNoticiasDto } from './edicao.noticias.dto';
import { TipoNoticia } from '@prisma/client';

describe('EdicaoNoticiasDto', () => {

  it('deve aceitar valores válidos', async () => {
    const dto = plainToInstance(EdicaoNoticiasDto, {
      idUsuario: 10,
      descricao: 'Texto qualquer',
      tipo: TipoNoticia.GERAL,
      mediaSrc: 'https://teste.com/imagem.png',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve permitir todos os campos vazios (porque são opcionais)', async () => {
    const dto = plainToInstance(EdicaoNoticiasDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve falhar quando idUsuario não é inteiro', async () => {
    const dto = plainToInstance(EdicaoNoticiasDto, {
      idUsuario: 'abc',
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isInt).toBe('O id do usuario deve ser um número.');
  });

  it('deve falhar quando descricao não é string', async () => {
    const dto = plainToInstance(EdicaoNoticiasDto, {
      descricao: 123,
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBe('A descricao deve ser um texto.');
  });

  it('deve falhar quando tipo não é string (enum)', async () => {
    const dto = plainToInstance(EdicaoNoticiasDto, {
      tipo: 123,
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBe('O tipo deve ser um texto.');
  });

  it('deve falhar quando mediaSrc não é string', async () => {
    const dto = plainToInstance(EdicaoNoticiasDto, {
      mediaSrc: 999,
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBe('A mediaSrc deve ser um texto.');
  });
});