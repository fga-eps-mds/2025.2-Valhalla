import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="h-auto w-full bg-texto-corpo border flex items-center justify-center py-3 px-3">

      <div className="mx-auto w-fit">
        <p className="text-center text-off-white text-xs flex items-center gap-2 hover:cursor-default">
          <span>© 2025 Guardiões da Universidade. Todos os direitos reservados.</span> 
          <a href={"https://github.com/fga-eps-mds/2025.2-Valhalla"}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-gray-400"
          >
          <FaGithub size={18}/>
          </a>
        </p>
      </div>
    </footer>
  );
}