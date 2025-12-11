'use client';

import Link from "next/link";
import { UsersIcon, ScaleIcon, ShieldExclamationIcon, LifebuoyIcon, LightBulbIcon, BuildingOffice2Icon } from "@heroicons/react/24/solid";
import InfoCards from "@/components/secao/secaoInfo";
import Navbar from "@/components/secao/navbar";
import BotaoMenu from "@/components/ui/botaoMenu";
import { useRouter } from "next/navigation";

export default function Orientacao() {

  const router = useRouter();

  return (
    <main>
      <div className="flex justify-center">
        <div className="w-full scroll-m-0 max-w-[1440px] bg-gray-50  rounded-md px-12 py-14 ">
          <div className="flex flex-col items-center  min-h-screen">
            <h1 className="text-4xl font-bold mt-10">Página de Orientações</h1>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              
              {/* Botão 1: Acolhimento */}
              <BotaoMenu
                icone={<UsersIcon className="w-12 h-12 fill-current" />} // Ícone de grupo
                texto="Direitos Humanos"
                onClick={() => router.push('/acolhimento')} 
              />

              {/* Botão 2: Integridade */}
              <BotaoMenu
                icone={<ScaleIcon className="w-12 h-12 stroke-[2.5]" />} // Ícone de boia/alvo
                texto="Integridade"
                onClick={() => router.push('/integridade')}
              />

              {/* Botão 3: Assédio */}
              <BotaoMenu
                icone={<ShieldExclamationIcon className="w-12 h-12 fill-current" />} // Ícone de grupo
                texto="Assédio"
                onClick={() => router.push('/assedio')} 
              />

              {/* Botão 4: Acolhimento */}
              <BotaoMenu
                icone={<LifebuoyIcon className="w-12 h-12 stroke-[2.5]" />} // Ícone de boia/alvo
                texto="Acolhimento"
                onClick={() => router.push('/acolhimento')}
              />              
              
              {/* Botão 5: Melhorias */}
              <BotaoMenu
                icone={<LightBulbIcon className="w-12 h-12 fill-current" />} // Ícone de grupo
                texto="Melhorias"
                onClick={() => router.push('/melhorias')} 
              />

              {/* Botão 6: Infraestrutura */}
              <BotaoMenu
                icone={<BuildingOffice2Icon className="w-12 h-12 stroke-[2.5]" />} // Ícone de boia/alvo
                texto="Infraestrutura"
                onClick={() => router.push('/infraestrutura')}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
    
  );
}