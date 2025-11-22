'use client';

import Image from "next/image";
import SecaoDesenvolvedores from "@/components/secaoDevs";
import Footer from "@/components/footer";
import Header from "@/components/header"
import FeaturesSection from "@/components/secao";
import Hero from "@/components/hero"

export default function Home() {
  return (
    <main>

      <header>
        <Header/>
      </header>

      <div className="flex justify-center">
        <div className="w-full scroll-m-0 max-w-[1440px] bg-gray-50  rounded-md px-12 py-14 ">
          <div><Hero/></div>
          {/* Seção Informações*/}
          <div><FeaturesSection/></div>
          
          {/* Seção dos Devs*/}
          <div><SecaoDesenvolvedores/></div>

        </div>
      </div>

      {/* Footer */}
      <footer>
        <Footer/>
      </footer>

    </main>
  )
}