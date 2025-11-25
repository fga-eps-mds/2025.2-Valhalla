import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    
    <header className="bg-texto-corpo h-18 shadow-md flex items-center justify-between px-5">
      <Link href="/" className="flex items-center gap-2 cursor-default">
          <Image
            src="/logos/Corujuda-Contorno.svg"
            alt="Logo Guardiões da Universidade"
            width={84}
            height={84}
            className="cursor-pointer"
          />
          <h1 className="text-white font-bold hover:cursor-default whitespace-nowrap
            text-2xl
            md:text-2xl
            lg:text-3xl
            ">
            Guardiões da Universidade
          </h1>
      </Link>

      {/* Criar os botões*/}
    </header>
  );
}