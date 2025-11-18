import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-texto-corpo h-17 shadow-md flex items-center justify-between px-5 pl-5 pr-15">
      {/*Conteúdo do header*/} {/*Esquerda: Logo e Título */}
      <Link href="/" className="flex items-center space-x-3">
        <>
          <Image
            src="/Corujuda-Contorno.svg"
            alt="Logo Guardiões da Universidade"
            width={84}
            height={84}
          />
          <h1 className="text-white text-3xl font-bold hover:cursor-default">
            Guardiões da Universidade
          </h1>
        </>
      </Link>
    </header>
  );
}