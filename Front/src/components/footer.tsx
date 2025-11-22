import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="h-10 w-full bg-[#0a1a3d] border  mt-10 flex items-center justify-center">
      <div className="mx-auto w-fit px-4 py-1 rounded">
        <p className="text-center text-gray-300 text-xs flex items-center gap-2 hover:cursor-default">
          <span>© 2025 Guardiões da Universidade. Todos os direitos reservados.</span> 
            <a href={"https://github.com/fga-eps-mds/2025.2-Valhalla"}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
            >
            <FaGithub size={17} />
            </a>
        </p>
      </div>
    </footer>
  );
}