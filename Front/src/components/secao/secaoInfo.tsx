import { ShieldCheckIcon, UsersIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";

export default function InfoCards() {
  return (
    <section className="w-full flex justify-center py-16">
      
      <article className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full px-6 cursor-default">

        {/* Card 1 */}
        <div className="
          bg-linear-to-br from-blue-400 to-blue-500
          shadow-md rounded-2xl overflow-hidden
          flex flex-col justify-between min-h-[280px]
          transition-transform duration-300 hover:scale-105"
        >
          <div className="p-8 text-white flex flex-col items-center gap-4">
            <ArrowsUpDownIcon className="w-12 h-12" />
            <h3 className="text-lg sm:text-xl font-semibold text-center leading-tight">
              Apoie Denúncias
            </h3>
            <p className="text-center opacity-90">
              Dê visibilidade às denúncias e ajude a tornar injustiças impossíveis de serem ignoradas.
            </p>
          </div>

          <a>
            <button className="
              w-full py-3 text-white font-medium
              bg-transparent border-t border-t-gray-50 
              hover:brightness-110 hover:bg-blue-600
              transition-all text-sm
              rounded-b-2xl cursor-pointer"
            >
              Saiba como Denunciar
            </button>
          </a>
        </div>

        {/* Card 2 */}
        <div className="
          bg-linear-to-br from-blue-500 to-blue-600
          shadow-md rounded-2xl overflow-hidden
          flex flex-col justify-between
          min-h-[280px]
          transition-transform duration-300 hover:scale-105
        ">
          <div className="p-8 text-white flex flex-col items-center gap-4">
            <ShieldCheckIcon className="w-12 h-12" />
            <h3 className="text-lg sm:text-xl font-semibold text-center leading-tight">
              Segurança Avançada
            </h3>
            <p className="text-center opacity-90">
              Suas informações são protegidas com as melhores práticas de segurança.
            </p>
          </div>

          <a>
            <button className="
              w-full py-3 text-white font-medium
              bg-transparent border-t border-t-gray-50 
              hover:brightness-110 hover:bg-blue-700
              transition-all text-sm
              rounded-b-2xl cursor-pointer"
            >
              Cadastre-se para denunciar
            </button>
          </a>
        </div>

        {/* Card 3 */}
        <div className="
          bg-linear-to-br from-blue-600 to-blue-700
          shadow-md rounded-2xl overflow-hidden
          flex flex-col justify-between
          min-h-[280px]
          transition-transform duration-300 hover:scale-105
        ">
          <div className="p-8 text-white flex flex-col items-center gap-4">
            <UsersIcon className="w-12 h-12" />
            <h3 className="text-lg sm:text-xl font-semibold text-center leading-tight">
              Experiência Colaborativa
            </h3>
            <p className="text-center opacity-90">
              A plataforma conecta pessoas, facilitando colaboração e troca de conhecimentos.
            </p>
          </div>

          <a>
            <button className="
              w-full py-3 text-white font-medium
              bg-transparent border-t border-t-gray-50 
              hover:brightness-110 hover:bg-blue-800
              transition-all text-sm
              rounded-b-2xl cursor-pointer"
            >
              Conheça as denúncias mais apoiadas
            </button>
          </a>      
        </div>

      </article>
    </section>
  );
}