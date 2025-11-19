import { CodeBracketIcon, ShieldCheckIcon, UsersIcon } from "@heroicons/react/24/solid";

export default function FeaturesSection() {
  return (
    <section className="w-full flex justify-center py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full px-6">

        {/* Card 1 */}
        <div className="
          bg-gradient-to-br from-blue-200 to-blue-400
          shadow-md rounded-2xl p-8 text-white
          flex flex-col items-center gap-4
          transform transition-all duration-300 hover:scale-105
        ">
          <CodeBracketIcon className="w-12 h-12" />
          <h3 className="text-xl font-semibold">Tecnologia Moderna</h3>
          <p className="text-center opacity-90">
            Nosso site utiliza ferramentas modernas para garantir desempenho e eficiência.
          </p>
        </div>

        {/* Card 2 */}
        <div className="
          bg-gradient-to-br from-blue-400 to-blue-500
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
          bg-gradient-to-br from-blue-500 to-blue-700
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

      </div>
    </section>
  );
}