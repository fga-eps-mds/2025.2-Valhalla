import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NoticiasDto } from "./noticias.dto";
import { TipoNoticia } from "@prisma/client";

describe("NoticiasDto", () => {
  it("deve ser válido com todos os campos corretos", async () => {
    const dto = plainToInstance(NoticiasDto, {
      descricao: "Uma notícia válida",
      tipo: TipoNoticia.GERAL,
      mediaSrc: "https://teste.com/imagem.jpg",
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it("deve falhar quando descricao está vazia", async () => {
    const dto = plainToInstance(NoticiasDto, {
      descricao: "",
      tipo: TipoNoticia.AVISO,
    });

    const errors = await validate(dto);

    const erroDescricao = errors.find(e => e.property === "descricao");
    expect(erroDescricao?.constraints?.isNotEmpty).toBe(
      "A descricao nao pode estar vazia."
    );
  });

  it("deve falhar quando descricao não é string", async () => {
    const dto = plainToInstance(NoticiasDto, {
      descricao: 123,
      tipo: TipoNoticia.EVENTO,
    });

    const errors = await validate(dto);

    const erroDescricao = errors.find(e => e.property === "descricao");
    expect(erroDescricao?.constraints?.isString).toBe(
      "A descricao deve ser um texto."
    );
  });

  it("deve falhar quando tipo está vazio", async () => {
    const dto = plainToInstance(NoticiasDto, {
      descricao: "Notícia",
      tipo: "",
    });

    const errors = await validate(dto);

    const erroTipo = errors.find(e => e.property === "tipo");
    expect(erroTipo?.constraints?.isNotEmpty).toBe(
      "O tipo nao pode estar vazio."
    );
  });

  it("deve falhar quando tipo não é string (ex: number)", async () => {
    const dto = plainToInstance(NoticiasDto, {
      descricao: "Notícia",
      tipo: 123,
    });

    const errors = await validate(dto);

    const erroTipo = errors.find(e => e.property === "tipo");
    expect(erroTipo?.constraints?.isString).toBe(
      "O tipo deve ser um texto."
    );
  });

  it("deve falhar quando mediaSrc não é string", async () => {
    const dto = plainToInstance(NoticiasDto, {
      descricao: "Notícia",
      tipo: TipoNoticia.GERAL,
      mediaSrc: 999,
    });

    const errors = await validate(dto);

    const erroMedia = errors.find(e => e.property === "mediaSrc");
  });
});