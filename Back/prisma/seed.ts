import { PrismaClient, CargoUsuario, TipoUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o Seed do Banco de Dados...');

  // 1. Definição da Senha Padrão (Hasheada)
  const senhaPadrao = 'Forte123@';
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(senhaPadrao, salt);

  // 2. Definição dos Usuários
  const usuarios = [
    {
      nome: 'Administrador Master',
      email: 'adminMaster@gmail.com',
      senha: senhaHash,
      cargo: CargoUsuario.OUTRO,
      tipo: TipoUsuario.ADMINMASTER,
      mediaSrc: null,
    },
    {
      nome: 'Administrador',
      email: 'admin@gmail.com',
      senha: senhaHash,
      cargo: CargoUsuario.OUTRO,
      tipo: TipoUsuario.ADMIN,
      mediaSrc: null,
    },
    {
      nome: 'Usuario',
      email: 'usuario@gmail.com',
      senha: senhaHash,
      cargo: CargoUsuario.OUTRO,
      tipo: TipoUsuario.COMUM,
      mediaSrc: null,
    },
  ];

  console.log('👥 Verificando e criando usuários...');
  
  for (const u of usuarios) {
    // Verifica se usuário existe (considerando lógica de Soft Delete)
    const userExists = await prisma.usuario.findFirst({
      where: {
        email: u.email,
        dataDelete: null,
      },
    });

    if (!userExists) {
      await prisma.usuario.create({
        data: {
          nome: u.nome,
          email: u.email,
          senha: u.senha,
          cargo: u.cargo,
          tipo: u.tipo,
          mediaSrc: u.mediaSrc,
        },
      });
      console.log(`✅ Usuário criado: ${u.nome} (${u.tipo})`);
    } else {
      console.log(`ℹ️  Usuário já existe: ${u.nome}`);
    }
  }

  // 3. Definição das Categorias
  const categorias = [
    'Integridade',
    'Acolhimento',
    'Assédio',
    'Direitos Humanos',
    'Melhorias',
    'Infraestrutura',
  ];

  console.log('📂 Verificando e criando categorias...');

  for (const nomeCategoria of categorias) {
    // Upsert: Cria se não existir, não faz nada se existir
    await prisma.categoria.upsert({
      where: { nome: nomeCategoria },
      update: {}, // Não atualiza nada se já existir
      create: {
        nome: nomeCategoria,
      },
    });
  }
  console.log('✅ Categorias garantidas.');

  console.log('🚀 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });