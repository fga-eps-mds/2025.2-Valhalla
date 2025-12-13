'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    UserCircleIcon, 
    ArrowRightEndOnRectangleIcon, 
    ArrowLeftIcon, 
    KeyIcon
} from '@heroicons/react/24/outline';
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '../../../contexts/AuthContext';
import { loginUsuario } from '@/utils/api';

import { CheckIcon } from '@heroicons/react/24/solid';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [lembrar, setLembrar] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(null); 

        if (!email || !senha) {
            setErro('Por favor, preencha todos os campos.');
            return;
        }
        try {
            const response = await loginUsuario(email, senha, lembrar);
            login(response.access_token, response.user);

            router.push('/denuncia');

        } catch (error) {
            console.error('ERRO DETALHADO DO LOGIN:', error);
            console.error('Erro ao fazer login:', error);
            setErro('Email ou senha incorretos.');
        }
    };
    return (
        <>

            <div className="w-[640px] min-h-[730px] rounded-2xl bg-white border border-gray-200 shadow-xl absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-8"> 
                
                <Link href="/" className="absolute top-6 left-6">
                    <ArrowLeftIcon className="w-10 h-10 text-azul-dark cursor-pointer hover:text-blue-600 transition" />
                </Link>

                <Image 
                    src="/logos/Corujuda-Contorno.svg"
                    alt="Logo do Guardiões da Universidade."
                    width={120}
                    height={120}
                    className="mt-2" 
                />
                
                <h1 className='text-[36px] text-texto-primario mb-10  font-fonte-primaria'>
                    Login
                </h1>

                <form className="w-full max-w-sm flex flex-col items-center" onSubmit={handleLogin}>
                    
                    <div className="w-full mb-5">
                        <label htmlFor="email" className="block text-2xl text-gray-800 mb-2 font-fonte-primaria">
                            E-mail
                        </label>
                        <div className="relative">
                            <UserCircleIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-azul-dark" />
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange= {(e) => setEmail(e.target.value)}
                                placeholder="Digite aqui seu Email" 
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-azul-dark font-(--fonte-primaria)"
                            />
                        </div>
                    </div>

                    <div className="w-full mb-5">
                        <label htmlFor="password" className="block text-2xl text-gray-800 mb-2 font-fonte-primaria">
                            Senha
                        </label>
                        <div className="relative">
                            <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-azul-dark" />
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="Digite aqui sua senha" 
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-azul-dark font-(--fonte-primaria)"
                            />
                        </div>
                    </div>

                    {erro && (
                        <p className="text-red-500 text-sm mb-4 w-full text-center bg-red-50 py-2 rounded-md border border-red-200">
                            {erro}
                        </p>
                    )}

                        <div className="w-full flex items-center justify-between mb-8">
                            
                            {/* Lado ESQUERDO: Checkbox + Texto */}
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="lembrar"
                                    checked={lembrar}
                                    onChange={() => setLembrar(!lembrar)}
                                    className="w-4 h-4 text-azul-principal border-gray-300 rounded focus:ring-azul-light cursor-pointer" 
                                />
                                <label htmlFor="lembrar" className="text-sm text-gray-600 cursor-pointer select-none">
                                    Lembrar-me
                                </label>
                            </div>

                            {/* Lado DIREITO: Link */}
                            <Link href="/recuperacao-senha" className="text-sm text-azul-principal hover:underline font-medium"> 
                                Esqueci a senha
                            </Link>
                        </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center border border-azul-dark rounded-xl py-3 gap-2 bg-azul-principal w-60 text-white hover:bg-[#254c9b] transition font-semibold cursor-pointer">
                        LOGIN
                        <ArrowRightEndOnRectangleIcon className='size-5'/>
                    </button>
                </form>

                <button className="mt-8 flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition">  {/* em construção */}
                    <Image src="/google.png" alt="Login com Google" width={48} height={48} /> 
                </button>

                <p className="mt-6 text-sm text-azul-dark">
                    Novo por aqui ?  {'   '}
                    <Link href="/cadastro" className="font-medium text-blue-600 hover:underline">
                        Crie sua conta
                    </Link>
                </p>

            </div>
        </>
    )
}
