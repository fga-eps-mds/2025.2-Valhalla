import { ShieldCheckIcon, UsersIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";


export default function FeaturesSection() {
  return (
    <section className="w-full flex justify-center py-16 bg-amber-300">
      
      <article className="grid grid-cols-1 md:grid-cols-3 gap-30 max-w-6xl w-full ">

        {/* Card 1 */}
        <div className="
          bg-linear-to-br from-blue-400 to-blue-500
          shadow-md rounded-2xl p-8 text-white
          flex flex-col items-center gap-4
          transform transition-all duration-300 hover:scale-105
          min-h-0
        ">
          <ArrowsUpDownIcon className="w-12 h-12" />
          <h3 className="text-xl font-semibold">Apoie Denúncias</h3>
          <p className="text-center opacity-90">
            Dê visibilidade às denúncias e ajude a tornar injustiças impossíveis de serem ignoradas.
          </p>
        </div>

        {/* Card 2 */}
        <div className="
          bg-linear-to-br from-blue-500 to-blue-600
          shadow-md rounded-2xl p-8 text-white
          flex flex-col items-center gap-4
          transform transition-all duration-300 hover:scale-105
        ">
          <ShieldCheckIcon className="w-12 h-12" />
          <h3 className="text-xl font-semibold">Segurança Avançada</h3>
          <p className="text-center opacity-90">
            Suas informações são protegidas com as melhores práticas de segurança.
          </p>
        </div>

        {/* Card 3 */}
        <div className="
          bg-linear-to-br from-blue-600 to-blue-700
          shadow-md rounded-2xl p-8 text-white
          flex flex-col items-center gap-4
          transform transition-all duration-300 hover:scale-105
        ">
          <UsersIcon className="w-12 h-12" />
          <h3 className="text-xl font-semibold">Experiência Colaborativa</h3>
          <p className="text-center opacity-90">
            A plataforma conecta pessoas, facilitando colaboração e troca de conhecimentos.
          </p>
        </div>

      </article>
    </section>

  );
}