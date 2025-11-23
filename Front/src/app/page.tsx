'use client';

import SecaoDesenvolvedores from "@/components/secaoDevs";
import Footer from "@/components/footer";
import Header from "@/components/header"
import InfoCards from "@/components/secaoInfo";
import Hero from "@/components/hero"

export default function Home() {
  return (
    <main>

      <header> <Header/> </header>

      <div className="flex justify-center">
        <div className="w-full scroll-m-0 max-w-[1440px] bg-gray-50  rounded-md px-12 py-14 ">
          <div> <Hero/> </div>
          {/* Seção Informações*/}
          <div> <InfoCards/> </div>
          
          {/* Seção dos Devs*/}
          <div id="devs"> <SecaoDesenvolvedores/> </div>

        </div>
      </div>

      <footer> <Footer/> </footer>

    </main>
  )
}