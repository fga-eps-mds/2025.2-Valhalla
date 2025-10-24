import { BeakerIcon } from '@heroicons/react/24/solid'
import Image from "next/image";

export default function Cadastro() {
    return (
        <>
        <div className="w-[40vw] h-[80vh] bg-white rounded-[1rem] opacity-80 shadow-[0_0.25rem_0.25rem_0_rgba(0,0,0,0.25)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
            <Image 
            src="/Corujuda.svg"
            alt='Logo do Guardiões da Universidade. Uma coruja com pelagem azul'
            width={160}
            height={160}
            className="mx-[]"
            />
            <h1>Cadastro</h1>
        </div>
        </>
    )
}