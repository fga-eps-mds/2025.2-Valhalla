import { AcademicCapIcon, UserCircleIcon, KeyIcon, ChevronUpDownIcon,ShieldCheckIcon,ArrowRightEndOnRectangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Image from "next/image";

export default function Cadastro() {
    return (
        <>
        <div className="w-[40vw] h-[80vh] rounded-[1rem] opacity-80 shadow-[0_0.25rem_0.25rem_0_rgba(0,0,0,0.25)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <Image 
            src="/Corujuda.svg"
            alt='Logo do Guardiões da Universidade. Uma coruja com pelagem azul'
            width={100}
            height={100}
            className=""
            />
            <h1 className='text-[36px] text-[#050505] style={{fontFamily: "var(--fonte-primaria)"}} mb-[4]'>Cadastro</h1>

            <ul className='flex flex-col items-center justify-center gap-3 w-full h-[45.31%]' >
                <li className='flex items-center px-2 border border-[#DDE3E9] rounded-[15px] w-[68.75%] h-[50px]'>
                    <AcademicCapIcon className='size-4'/>
                    <input type="text" 
                    placeholder='Digite aqui seu Nome'
                    className="w-full outline-none px-[9px]"
                    />
                </li>
                
                <li className='flex items-center px-2 border border-[#DDE3E9] rounded-[15px] w-[68.75%] h-[50px]'>
                    <UserCircleIcon className='size-4'/>
                    <input type="text" 
                    placeholder='Digite aqui seu Email'
                    className="w-full outline-none px-[9px]"
                    />
                </li>
                
                <li className='flex items-center px-2 border border-[#DDE3E9] rounded-[15px] w-[68.75%] h-[50px]'>
                    <KeyIcon className='size-4'/>
                    <input type="password" 
                    placeholder='Digite aqui sua Senha'
                    className="w-full outline-none px-[9px]"
                    />
                </li>
                
                <li className='flex items-center px-2 border border-[#DDE3E9] rounded-[15px] w-[68.75%] h-[50px]'>
                    <KeyIcon className='size-4'/>
                    <input type="password" 
                    placeholder='Digite aqui sua Senha'
                    className="w-full outline-none px-[9px]"
                    />
                </li>
                
                <li className='flex items-center px-2 border border-[#DDE3E9] rounded-[15px] w-[68.75%] h-[50px]'>
                    <ChevronUpDownIcon className='size-4'/>
                    <select className='w-full outline-none px-[9px]'>
                        <option value="" disabled selected>Selecione sua Ocupação</option>
                        <option value="Servidor">Servidor</option>
                        <option value="Aluno">Aluno</option>
                    </select>
                    
                    
                </li>
            </ul>

            <button
                type="submit"
                className="flex items-center justify-center border border-[#1A2A4A] rounded-md py-[11px] bg-[#3060BF] w-[37.5%] h-[8%] text-white rounded hover:bg-[#67A8FF] transition">
                CADASTRAR
                <ArrowRightEndOnRectangleIcon className='size-5'/>
            </button>
        
            <div className="flex items-center gap-2 mt-[38px] mb-[52px]">
                <input type="checkbox" id="termos" className="w-4 h-4" />
                <label htmlFor="termos" className="text-sm text-gray-700">
                    Declaro que li e aceito os <a href="#" className="text-blue-500 underline">termos de uso</a>
                </label>
                <ShieldCheckIcon className='size-6'/>
            </div>
        </div>
        </>
    )
}