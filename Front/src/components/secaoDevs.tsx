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
    photo: "/devs/dev3.jpg",
    github: "https://github.com/Gustavo2703",
  },
  {
    name: "Julia Gabriella",
    photo: "/devs/dev4.jpg",
    github: "https://github.com/juliagabriellafs",
  },
  {
    name: "Laura Rogelin",
    photo: "/devs/dev5.jpg",
    github: "https://github.com/laurarogelin",
  },
  {
    name: "Lucas Alves",
    photo: "/devs/dev6.jpg",
    github: "https://github.com/xLucasMelo",
  },
  {
    name: "Lucas Oliveira",
    photo: "/devs/dev7.jpg",
    github: "https://github.com/dev-LucasDpaula",
  },
  {
    name: "Pedro Henrique",
    photo: "/devs/americo.jpeg",
    github: "https://github.com/dev-americo",
  },
  {
    name: "Pedro Ian",
    photo: "/devs/ian.jpeg",
    github: "https://github.com/pedroiaan",
  },
  {
    name: "Pedro Lucas",
    photo: "/devs/pedrin.jpg",
    github: "https://github.com/Pwdrinho",
  },
];

export default function SecaoDesenvolvedores() {
  return (
    <section className="mt-96 w-full bg-gray-100">
      <h2 className="text-center text-display mb-6">Desenvolvedores</h2>

      <div className="grid grid-cols-5 gap-20 place-items-center">
        {developers.map((dev, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-1.5 hover:scale-110 transition"
          >
            <img
              src={dev.photo}
              alt={dev.name}
              className="w-30 h-30 rounded-full object-cover shadow-2xl"
            />

            <p className="text-lg font-medium hover:cursor-default">{dev.name}</p>

            <a
              href={dev.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-500 "
            >
              <FaGithub size={28} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}