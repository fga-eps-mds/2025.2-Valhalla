import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';
import { CargoUsuario, TipoUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Tokens para usar nos testes
  let tokenComum: string;
  let tokenAdmin: string;
  let tokenMaster: string;

  // IDs úteis
  let idComum: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Importante: Ativar validação global para testar DTOs
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    prisma = app.get(PrismaService);
    await app.init();
  });

  // LIMPEZA DO BANCO E SEED ANTES DOS TESTES
  beforeAll(async () => {
    // 1. Limpa o banco (Ordem importa por causa das FKs)
    await prisma.comentario.deleteMany();
    await prisma.denuncia.deleteMany();
    await prisma.categoria.deleteMany();
    await prisma.usuario.deleteMany();

    const senhaHash = await bcrypt.hash('123456', 10);

    // 2. Cria Usuário COMUM
    const comum = await prisma.usuario.create({
      data: {
        nome: 'Comum', email: 'comum@teste.com', senha: senhaHash,
        cargo: CargoUsuario.ESTUDANTE, tipo: TipoUsuario.COMUM,
      }
    });
    idComum = comum.id;

    // 3. Cria Usuário ADMIN
    await prisma.usuario.create({
      data: {
        nome: 'Admin', email: 'admin@teste.com', senha: senhaHash,
        cargo: CargoUsuario.SERVIDOR, tipo: TipoUsuario.ADMIN,
      }
    });

    // 4. Cria Usuário ADMINMASTER
    await prisma.usuario.create({
      data: {
        nome: 'Master', email: 'master@teste.com', senha: senhaHash,
        cargo: CargoUsuario.OUTRO, tipo: TipoUsuario.ADMINMASTER,
      }
    });
  });

  afterAll(async () => {
    await app.close();
  });

  // --- TESTES DE AUTENTICAÇÃO ---
  describe('Auth Module', () => {
    it('/auth/login (POST) - Deve logar e retornar tokens', async () => {
      // Login Comum
      const resComum = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'comum@teste.com', senha: '123456' })
        .expect(200);
      tokenComum = resComum.body.access_token;

      // Login Admin
      const resAdmin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@teste.com', senha: '123456' })
        .expect(200);
      tokenAdmin = resAdmin.body.access_token;

      // Login Master
      const resMaster = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'master@teste.com', senha: '123456' })
        .expect(200);
      tokenMaster = resMaster.body.access_token;

      expect(tokenComum).toBeDefined();
    });

    it('/auth/login (POST) - Deve falhar com senha errada', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'comum@teste.com', senha: 'errada' })
        .expect(401);
    });
  });

  // --- TESTES DE CATEGORIAS (RBAC) ---
  describe('Categorias Module', () => {
    it('/categorias (POST) - Comum NÃO deve criar categoria', () => {
      return request(app.getHttpServer())
        .post('/categorias')
        .set('Authorization', `Bearer ${tokenComum}`)
        .send({ nome: 'Teste Falha' })
        .expect(403); // Forbidden
    });

    it('/categorias (POST) - AdminMaster DEVE criar categoria', () => {
      return request(app.getHttpServer())
        .post('/categorias')
        .set('Authorization', `Bearer ${tokenMaster}`)
        .send({ nome: 'Infraestrutura' })
        .expect(201)
        .expect((res) => {
          expect(res.body.nome).toEqual('Infraestrutura');
        });
    });

    it('/categorias (GET) - Deve listar categorias publicamente', () => {
      return request(app.getHttpServer())
        .get('/categorias')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  // --- TESTES DE DENÚNCIAS ---
  describe('Denuncias Module', () => {
    let idCategoria: number;
    let idDenuncia: number;

    // Pega uma categoria válida criada anteriormente
    beforeAll(async () => {
      let cat = await prisma.categoria.findFirst();

      // Se o banco estiver limpo, criamos a categoria para o teste não quebrar
      if (!cat) {
        cat = await prisma.categoria.create({
          data: { nome: 'Categoria Teste E2E' }
        });
      }

      idCategoria = cat.id;
    });

    it('/denuncias (POST) - Deve criar denúncia logado', async () => {
      const response = await request(app.getHttpServer())
        .post('/denuncias')
        .set('Authorization', `Bearer ${tokenComum}`)
        .send({
          descricao: 'Buraco na via',
          idCategoria: idCategoria,
          mediaSrc: 'img.jpg',
          anonimato: false
        })
        .expect(201);
      
      idDenuncia = response.body.id;
      expect(response.body.idUsuario).toEqual(idComum);
    });

    it('/denuncias (GET) - Deve listar denúncias', () => {
      return request(app.getHttpServer())
        .get('/denuncias')
        .expect(200)
        .expect((res) => {
          expect(res.body[0].descricao).toEqual('Buraco na via');
        });
    });

    it('/denuncias/:id (PATCH) - Outro usuário NÃO deve editar', async () => {
      // Admin tentando editar denúncia do Comum (Deve falhar pela regra de autoria)
      return request(app.getHttpServer())
        .patch(`/denuncias/${idDenuncia}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ descricao: 'Tentativa de hack' })
        .expect(403);
    });

    it('/denuncias/:id (PATCH) - Dono DEVE editar', () => {
      return request(app.getHttpServer())
        .patch(`/denuncias/${idDenuncia}`)
        .set('Authorization', `Bearer ${tokenComum}`)
        .send({ descricao: 'Buraco arrumado' })
        .expect(200)
        .expect((res) => {
          expect(res.body.descricao).toEqual('Buraco arrumado');
        });
    });

    it('/denuncias/:id (DELETE) - Admin DEVE conseguir deletar (Soft Delete) denúncia de Comum', () => {
      return request(app.getHttpServer())
        .delete(`/denuncias/${idDenuncia}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(200);
    });

    it('/denuncias/:id (GET) - Não deve encontrar denúncia deletada', () => {
      return request(app.getHttpServer())
        .get(`/denuncias/${idDenuncia}`)
        .expect(404);
    });
  });
});