import { AcademicCapIcon, UserCircleIcon, KeyIcon, ChevronUpDownIcon,ShieldCheckIcon,ArrowRightEndOnRectangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Image from "next/image";

export default function Cadastro() {
    return (
        <>
        <div className="w-[40vw] h-[80vh] bg-white rounded-[1rem] opacity-80 shadow-[0_0.25rem_0.25rem_0_rgba(0,0,0,0.25)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pb-6">
            <Image 
            src="/Corujuda.svg"
            alt='Logo do Guardiões da Universidade. Uma coruja com pelagem azul'
            width={160}
            height={160}
            className="mx-[]"
            />
            <h1>Cadastro</h1>

            <ul className='flex flex-col gap-2 px-6' >
                <li className='flex items-center border'>
                    <AcademicCapIcon className='size-6'/>
                    <input type="text" 
                    placeholder='Digite aqui seu Nome'
                    className="w-full outline-none"
                    />
                </li>
                
                <li className='flex items-center border'>
                    <UserCircleIcon className='size-6'/>
                    <input type="text" 
                    placeholder='Digite aqui seu Email'
                    className="w-full outline-none"
                    />
                </li>
                
                <li className='flex items-center border'>
                    <KeyIcon className='size-6'/>
                    <input type="password" 
                    placeholder='Digite aqui sua Senha'
                    className="w-full outline-none"
                    />
                </li>
                
                <li className='flex items-center border'>
                    <KeyIcon className='size-6'/>
                    <input type="password" 
                    placeholder='Digite aqui sua Senha'
                    className="w-full outline-none"
                    />
                </li>
                
                <li className='flex items-center border'>
                    <ChevronUpDownIcon className='size-6'/>
                    <select className='w-full outline-none'>
                        <option value="" disabled selected>Selecione sua Ocupação</option>
                        <option value="Servidor">Servidor</option>
                        <option value="Aluno">Aluno</option>
                    </select>
                    
                    
                </li>
            </ul>

        </div>
        </>
    )
}