import { FaGithub } from "react-icons/fa";

interface Dev {
  name: string;
  photo: string;
  github: string;
}

const developers: Dev[] = [
  {
    name: "Antonio Lucas",
    photo: "/devs/antonio.jpeg",
    github: "https://github.com/Devv-Antonio",
  },
  {
    name: "Gabriel Diniz",
    photo: "/devs/diniz.jpeg",
    github: "https://github.com/GabrielDiniz12",
  },
  {
    name: "Gustavo Bonifacio",
    photo: "/devs/bonifacio.jpg",
    github: "https://github.com/Gustavo2703",
  },
  {
    name: "Julia Gabriella",
    photo: "/devs/julia.jpg",
    github: "https://github.com/juliagabriellafs",
  },
  {
    name: "Laura Rogelin",
    photo: "/devs/laura.jpg",
    github: "https://github.com/laurarogelin",
  },
  {
    name: "Lucas Alves",
    photo: "/devs/dev6.jpg",
    github: "https://github.com/xLucasMelo",
  },
  {
    name: "Lucas Oliveira",
    photo: "/devs/luquinhas.jpg",
    github: "https://github.com/dev-LucasDpaula",
  },
  {
    name: "Pedro Ian",
    photo: "/devs/ian.jpeg",
    github: "https://github.com/pedroiaan",
  },
  {
    name: "Pedro Henrique",
    photo: "/devs/americo.jpeg",
    github: "https://github.com/dev-americo",
  },
  {
    name: "Pedro Lucas",
    photo: "/devs/pedrin.jpg",
    github: "https://github.com/Pwdrinho",
  },
];

export default function SecaoDesenvolvedores() {
  return (
    <section className="px-8 py-8">

      <h2 className="text-center text-display mb-8 cursor-default">
        Desenvolvedores
      </h2>

      <div className="gap-10 place-items-center
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-5 "
        >
        {developers.map((dev, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-2 hover:scale-110 transition">
            <img
              src={dev.photo}
              alt={dev.name}
              className="w-30 h-30 rounded-full object-cover shadow-lg sm:w-32 sm:h-32 "
            />

            <p className="text-lg font-medium hover:cursor-default">
              {dev.name}
            </p>
            
            <a
              href={dev.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 "
            >
              <FaGithub size={28} />
            </a>
          </div>
        ))}
      </div>

    </section>
  );
}