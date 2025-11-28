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
          <div className="flex flex-col items-center  min-h-screen py-0">
            <h1 className="text-4xl font-bold mb-8">Página de Orientação</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

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
        
              <Link href="/assedio" className="
                bg-linear-to-br from-blue-400 to-blue-500
                shadow-md rounded-2xl overflow-hidden
                flex flex-col justify-between min-h-[120px]
                transition-transform duration-300 hover:scale-105"
              >
                <div className="p-8 text-white flex flex-col items-center gap-4">
                  <ArrowsUpDownIcon className="w-12 h-12" />
                  <h3 className="text-lg sm:text-xl font-semibold text-center leading-tight">
                    Assedio
                  </h3>
                </div>
              </Link>
        
              <Link href="/direitos-humanos" className="
                bg-linear-to-br from-blue-400 to-blue-500
                shadow-md rounded-2xl overflow-hidden
                flex flex-col justify-between min-h-[120px]
                transition-transform duration-300 hover:scale-105"
              >
                <div className="p-8 text-white flex flex-col items-center gap-4">
                  <ArrowsUpDownIcon className="w-12 h-12" />
                  <h3 className="text-lg sm:text-xl font-semibold text-center leading-tight">
                    Direitos Humanos
                  </h3>
                </div>
              </Link>
                    
              <Link href="/infraestrutura" className="
                bg-linear-to-br from-blue-400 to-blue-500
                shadow-md rounded-2xl overflow-hidden
                flex flex-col justify-between min-h-[120px]
                transition-transform duration-300 hover:scale-105"
              >
                <div className="p-8 text-white flex flex-col items-center gap-4">
                  <ArrowsUpDownIcon className="w-12 h-12" />
                  <h3 className="text-lg sm:text-xl font-semibold text-center leading-tight">
                    Infraestrutura
                  </h3>
                </div>
              </Link>
        
              <Link href="/integridade" className="
                bg-linear-to-br from-blue-400 to-blue-500
                shadow-md rounded-2xl overflow-hidden
                flex flex-col justify-between min-h-[120px]
                transition-transform duration-300 hover:scale-105"
              >
                <div className="p-8 text-white flex flex-col items-center gap-4">
                  <ArrowsUpDownIcon className="w-12 h-12" />
                  <h3 className="text-lg sm:text-xl font-semibold text-center leading-tight">
                    Integridade
                  </h3>
                </div>
              </Link>
        
              <Link href="/melhorias" className="
                bg-linear-to-br from-blue-400 to-blue-500
                shadow-md rounded-2xl overflow-hidden
                flex flex-col justify-between min-h-[120px]
                transition-transform duration-300 hover:scale-105"
              >
                <div className="p-8 text-white flex flex-col items-center gap-4">
                  <ArrowsUpDownIcon className="w-12 h-12" />
                  <h3 className="text-lg sm:text-xl font-semibold text-center leading-tight">
                    Melhorias
                  </h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
