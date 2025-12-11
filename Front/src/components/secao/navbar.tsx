'use client'; // Obrigatório para 'usePathname' e 'Link'

// --- 1. IMPORTAÇÕES ---
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Importamos os ícones (do pacote "solid" que funcionou para si)
import {
  BookOpenIcon,
  NewspaperIcon,
  HomeIcon,
  ArchiveBoxIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';

// --- 2. DEFINIÇÃO DO COMPONENTE ---
export default function Navbar() {

  // --- 3. HOOK PARA ROTA ATIVA ---
  const pathname = usePathname();

  const { user } = useAuth();

  const isLoggedIn = !!user;

  if (isLoggedIn) {
  return (

    // CONTENTOR PRINCIPAL (HEADER)
    <header className="
      fixed top-0 left-0 right-0  /* Fixo no topo */
      bg-azul-dark          /* A sua cor de fundo */
      h-16                       /* Altura de 64px */
      shadow-md                  /* Sombra */
      flex items-center          /* Alinhamento vertical */
      justify-between            /* Itens nos cantos */
      px-6                       /* Espaçamento lateral */
      z-10                       /* Camada (acima de outro conteúdo) */
    ">

      {/* LADO ESQUERDO: Logo e Título */}
        <div className="flex items-center space-x-3">

            <Link href="/" aria-label="Página Inicial">

                {/* LOGO (da pasta /public) */}
                <img
                src="logos/logo-navbar.svg"
                width={300}
                />

            </Link>

         

        </div>

      {/* LADO DIREITO: Ícones de Navegação DINÂMICOS */}
      <div className="flex items-center space-x-4">

        {/* ÍCONE 1: ORIENTAÇÃO */}
        <Link href="/orientacao" aria-label="Orientação" className="group">
          <BookOpenIcon className={`
            h-8 w-8 transition-colors duration-200
            ${
              pathname === '/orientacao' 
              ? 'text-amarelo'  
              : 'text-branco group-hover:text-azul-light'
            }
          `}/>
        </Link>

        {/* ÍCONE 2: NOTÍCIAS */}
        <Link href="/noticias" aria-label="Notícias" className="group">
          <NewspaperIcon className={`
            h-8 w-8 transition-colors duration-200
            ${pathname === '/noticias' 
              ? 'text-amarelo' 
              : 'text-branco group-hover:text-azul-light'}
          `}/>
        </Link>

        {/* ÍCONE 3: PÁGINA HOME/DENÚNCIA */}
        <Link href="/denuncia" aria-label="Página de Denúncias" className="group">
          <HomeIcon className={`
            h-8 w-8 transition-colors duration-200
            ${pathname === '/denuncia' 
              ? 'text-amarelo' 
              : 'text-branco group-hover:text-azul-light'}
          `}/>
        </Link>

        {/* ÍCONE 4: GERENCIA */}
        <Link href="/gerencia" aria-label="Gerencia" className="group">
          <ArchiveBoxIcon className={`
            h-8 w-8 transition-colors duration-200
            ${pathname === '/gerencia' 
              ? 'text-amarelo' 
              : 'text-branco group-hover:text-azul-light'}
          `}/>
        </Link>

        {/* ÍCONE 5: MEU PERFIL */}
        <Link href="/perfil" aria-label="Meu Perfil" className="group">
          <UserCircleIcon className={`
            h-8 w-8 transition-colors duration-200
            ${pathname === '/perfil' 
              ? 'text-amarelo' 
              : 'text-branco group-hover:text-azul-light'}
          `}/>
        </Link>

      </div>
    </header>
  );
} else {

  return (

    // CONTENTOR PRINCIPAL (HEADER)
    <header className="
      fixed top-0 left-0 right-0  /* Fixo no topo */
      bg-azul-dark          /* A sua cor de fundo */
      h-16                       /* Altura de 64px */
      shadow-md                  /* Sombra */
      flex items-center          /* Alinhamento vertical */
      justify-between            /* Itens nos cantos */
      px-6                       /* Espaçamento lateral */
      z-10                       /* Camada (acima de outro conteúdo) */
    ">

      {/* LADO ESQUERDO: Logo e Título */}
        <div className="flex items-center space-x-3">

            <Link href="/" aria-label="Página Inicial">

                {/* LOGO (da pasta /public) */}
                <img
                src="logos/logo-navbar.svg"
                width={300}
                />

            </Link>

         

        </div>

     <div className="flex items-center gap-4">
      {/* Botão Login: Borda branca, Hover Amarelo */}
      <Link
        href="/login"
        className="rounded-full border border-white px-6 py-2 font-medium text-white transition-colors duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
      >
        Login
      </Link>

      {/* Botão Cadastro: Azul, Hover Branco */}
      <Link
        href="/cadastro"
        className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white transition-colors duration-300 hover:bg-white hover:text-blue-600"
      >
        Cadastro
      </Link>
    </div>
    </header>
  );
}
}
