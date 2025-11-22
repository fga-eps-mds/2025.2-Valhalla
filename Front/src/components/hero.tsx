"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <article className="grid grid-cols-1 items-center md:grid-cols-2 bg-purple-400 ">

  <div className="order-2 md:order-1 max-w-xl my-12 gap-24 ml-10 mr-10">
    <div>
      <h1 className="text-h1">Guardiões da Universidade</h1>

      <p className="text-medium text-justify mb-8"> 
        O projeto <em>Guardiões da Universidade</em> é uma plataforma criada para dar voz à comunidade da <strong>Universidade de Brasília UnB</strong>, permitindo que discentes e servidores conheçam os procedimentos oficiais de denúncia e visualizem as principais demandas da universidade.
        <br />
        Aqui, você encontra orientações claras, links e o passo a passo para registrar denúncias nos canais oficiais competentes. <em>Mesmo não sendo um meio oficial da UnB</em>, o projeto existe para <strong>desburocratizar, informar e fortalecer o senso de comunidade</strong> e segurança, destacando os problemas que impactam o dia a dia da universidade.
      </p>

      <div className="flex gap-8 justify-center">
        <button className="text-sm w-36 h-12 bg-white hover:bg-gray-200 text-texto-corpo rounded-md cursor-pointer shadow-sm hover:shadow-md transition">
          Sobre Nós
        </button>
        <button className="text-sm w-36 h-12 bg-azul-principal hover:bg-azul-hover text-off-white rounded-md cursor-pointer shadow-sm hover:shadow-md transition">
          Denuncie
        </button>
      </div>
    </div>
  </div>

  {/* IMAGEM */}
  <div className="order-1 md:order-2 flex justify-center my-12 gap-24 ml-2 mr-2">
    <Image
      src="/FCTE.jpg"
      alt="FCTE - Campus UnB Gama"
      width={633}
      height={473}
      className="object-cover rounded-xl"
    />
  </div>

</article>
  );
}