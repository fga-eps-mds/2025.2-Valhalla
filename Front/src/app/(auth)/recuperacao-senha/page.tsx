'use client';

import React, { useState }from 'react';
import { 
    UserCircleIcon, 
    ArrowLeftIcon,
    ArrowRightEndOnRectangleIcon
} from '@heroicons/react/24/outline';
import Image from "next/image";
import Link from "next/link";
import { EmailRecuperação } from '@/app/utils/api';

export default function RecuperarSenha() {
    const [email, setEmail] = useState ('');
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        
        setErro(null);
        setSucesso(null);

       
        if (!email) {
            setErro('Por favor, insira seu email cadastrado.');
            return;
        }
    setCarregando(true); 

        try {
            await EmailRecuperação(email);
            
            setSucesso('Link de recuperação enviado! Verifique sua caixa de entrada e spam.');
            setEmail('');

        } catch (error) {
            console.error('Erro ao solicitar recuperação:', error);
            setErro('Email não cadastrado ou erro ao enviar. Tente novamente.');

        } finally {
            setCarregando(false); 
        }
    };

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

                <form className="w-full max-w-sm flex flex-col items-center" onSubmit={handleSubmit} >
                    
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
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={carregando}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-[#1A2A4A] font-[var(--fonte-primaria)]"
                            />
                        </div>
                    </div>

                    {erro && (
                        <p className="text-red-500 text-sm mb-4 w-full text-center bg-red-50 py-2 rounded-md border border-red-200">
                            {erro}
                        </p>
                    )}
                    {sucesso && (
                        <p className="text-green-600 text-sm mb-4 w-full text-center bg-green-50 py-2 rounded-md border border-green-200">
                            {sucesso}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="flex items-center justify-center border border-[#1A2A4A] rounded-xl py-3 gap-2 bg-[#3060BF] w-[240px] text-white hover:bg-[#254c9b] transition font-semibold disabled:bg-gray-400"
                        disabled={carregando} 
                    >
                        {carregando ? 'Enviando...' : 'Enviar Link'}
                        
                        {!carregando && <ArrowRightEndOnRectangleIcon className='size-5'/>}
                    </button>
                </form>

                <p className="mt-15 text-sm text-gray-600">
                    Não esqueça de verificar sua caixa de Spam
                </p>

            </div>
        </>
    )
}