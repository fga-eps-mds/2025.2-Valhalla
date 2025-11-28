'use client';

import Link from "next/link";
import { ShieldCheckIcon, UsersIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import InfoCards from "@/components/secaoInfo";
import Navbar from "@/components/navbar";

export default function Orientacao() {
  return (
    <main>

      <Navbar/>
      
      <div className="flex justify-center">
        <div className=" w-full scroll-m-0 max-w-[1440px] bg-gray-100  rounded-md px-12 py-14 ">
          <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-8">Página de Orientação</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Card Acolhimento */}
        <Link href="/acolhimento" className="
          bg-linear-to-br from-blue-400 to-blue-500
          shadow-md rounded-2xl overflow-hidden
          flex flex-col justify-between min-h-[120px]
          transition-transform duration-300 hover:scale-105"
        >
          <div className="p-8 text-white flex flex-col items-center gap-4">
            <ArrowsUpDownIcon className="w-12 h-12" />
            <h3 className="text-lg sm:text-xl font-semibold text-center leading-tight">
              Acolhimento
            </h3>
          </div>
        </Link>
              
              <Link href="/orientacao/assedio" className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <h2 className="text-xl font-semibold">Assedio</h2>
              </Link>
              <Link href="/orientacao/direitos-humanos" className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <h2 className="text-xl font-semibold">Direitos Humanos</h2>
              </Link>
              <Link href="/orientacao/infraestrutura" className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <h2 className="text-xl font-semibold">Infraestrutura</h2>
              </Link>
              <Link href="/orientacao/integridade" className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <h2 className="text-xl font-semibold">Integridade</h2>
              </Link>
              <Link href="/orientacao/melhorias" className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <h2 className="text-xl font-semibold">Melhorias</h2>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
