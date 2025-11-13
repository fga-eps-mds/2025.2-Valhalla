'use client';

import React from 'react';
import { 
    UserCircleIcon, 
    ArrowLeftIcon,
    ArrowRightEndOnRectangleIcon
} from '@heroicons/react/24/outline';
import Image from "next/image";
import Link from "next/link";

export default function RecuperarSenha() {

    return (
        <>
            <div className="w-[640px] h-[730px] rounded-2xl bg-white border border-gray-200 shadow-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-8"> 
                
                <Link href="/" className="absolute top-6 left-6">
                    <ArrowLeftIcon className="w-10 h-10 text-[#1A2A4A] cursor-pointer hover:text-blue-600 transition" />
                </Link>
                {/* arrumar a logo*/}
                <Image 
                    src="/Corujuda - contorno.svg"    
                    alt='Logo do Guardiões da Universidade. Uma coruja com pelagem azul'
                    width={120}
                    height={120}
                    className="mt-8"
                />
                
                <h1 className='text-[36px] text-[#050505] mb-20 font-bold font-[var(--fonte-primaria)]'>
                    Recuperação de Senha
                </h1>

                <form className="w-full max-w-sm flex flex-col items-center" >
                    
                    <div className="w-full mb-14">
                        <label htmlFor="email" className="sr-only">
                            Insira seu Email Cadastrado
                        </label>
                        <div className="relative">
                            <UserCircleIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#1A2A4A]" />
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="Insira seu Email Cadastrado" 
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-[#1A2A4A] font-[var(--fonte-primaria)]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="flex items-center justify-center border border-[#1A2A4A] rounded-xl py-3 gap-2 bg-[#3060BF] w-[240px] text-white hover:bg-[#254c9b] transition font-semibold disabled:bg-gray-400"                   >
                        Enviar Link
                        <ArrowRightEndOnRectangleIcon className='size-5'/>
                    </button>
                </form>

                <p className="mt-15 text-sm text-gray-600">
                    Não esqueça de verificar sua caixa de Spam
                </p>

            </div>
        </>
    )
}