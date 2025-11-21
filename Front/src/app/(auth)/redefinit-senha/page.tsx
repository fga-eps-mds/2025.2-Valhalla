'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { 
    ArrowLeftIcon, 
    LockClosedIcon 
} from '@heroicons/react/24/outline';
import { resetarSenha } from '@/app/utils/api';


function FormularioRedefinicao() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token'); 

    const [senha, setSenha] = useState('');
    const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(null);
        setSucesso(null);

        if (!senha || !confirmacaoSenha) {
            setErro('Por favor, preencha todos os campos.');
            return;
        }

        if (senha !== confirmacaoSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        if (!token) {
            setErro('Token inválido ou expirado. Solicite uma nova recuperação de senha.');
            return;
        }

        setCarregando(true);

        try {
            
            await resetarSenha(token, senha);
            
            setSucesso('Senha redefinida com sucesso! Você já pode fazer login.');
            setSenha('');
            setConfirmacaoSenha('');
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            setErro('Não foi possível redefinir a senha. O link pode ter expirado.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="w-full max-w-lg min-h-[550px] rounded-2xl bg-white border border-gray-200 shadow-xl flex flex-col items-center p-8 sm:p-10 relative">

                {/* Back Link */}
                <a href="/" className="absolute top-6 left-6" aria-label="Voltar para a página inicial">
                    <ArrowLeftIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#1A2A4A] cursor-pointer hover:text-blue-600 transition" />
                </a>

                <img
                    src="/Corujuda - contorno.svg"
                    alt='Logo do Guardiões da Universidade'
                    width={120}
                    height={120}
                    className="mt-8 mb-4"
                />

                <h1 className='text-3xl sm:text-[36px] text-[#050505] mb-4 font-extrabold text-center'>
                    Redefinição de Senha
                </h1>
                
                <p className='text-gray-600 mb-10 text-center'>
                    Digite a nova senha abaixo:
                </p>

                <form className="w-full max-w-sm flex flex-col items-center" onSubmit={handleSubmit}>

                    {/* Campo de Senha */}
                    <div className="w-full mb-6">
                        <label htmlFor="senha" className="sr-only">Nova Senha</label>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#1A2A4A]" />
                            <input
                                type="password"
                                id="senha"
                                placeholder="Nova Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                disabled={carregando || !!sucesso}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-[#3060BF]/50 focus:border-[#3060BF] text-gray-800 placeholder-[#1A2A4A] transition duration-150"
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    {/* Campo de Confirmação */}
                    <div className="w-full mb-10">
                        <label htmlFor="confirmacaoSenha" className="sr-only">Confirmação de Senha</label>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#1A2A4A]" />
                            <input
                                type="password"
                                id="confirmacaoSenha"
                                placeholder="Confirmação"
                                value={confirmacaoSenha}
                                onChange={(e) => setConfirmacaoSenha(e.target.value)}
                                disabled={carregando || !!sucesso}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-[#3060BF]/50 focus:border-[#3060BF] text-gray-800 placeholder-[#1A2A4A] transition duration-150"
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    {/* Mensagens */}
                    {erro && (
                        <div className="text-red-700 text-sm mb-6 w-full text-center bg-red-100 p-3 rounded-xl border border-red-300 transition duration-300">
                            {erro}
                        </div>
                    )}
                    {sucesso && (
                        <div className="text-green-700 text-sm mb-6 w-full text-center bg-green-100 p-3 rounded-xl border border-green-300 transition duration-300">
                            {sucesso}
                        </div>
                    )}

                    {/* Botão */}
                    <button
                        type="submit"
                        className="flex items-center justify-center border-2 border-[#1A2A4A] rounded-xl py-3 px-8 gap-2 bg-[#3060BF] w-full text-white font-semibold shadow-lg hover:bg-[#254c9b] transition duration-200 disabled:bg-gray-400 disabled:border-gray-500 disabled:shadow-none"
                        disabled={carregando || !!sucesso}
                    >
                        {carregando ? (
                            <span className="flex items-center gap-2">Enviando...</span>
                        ) : (
                            <>
                                Redefinir Senha
                                <LockClosedIcon className='size-5' />
                            </>
                        )}
                    </button>
                    
                    {sucesso && (
                        <a href="/cadastro/login" className="mt-6 text-sm text-[#3060BF] hover:underline transition">
                            Ir para Login
                        </a>
                    )}
                </form>
            </div>
        </div>
    );
}


export default function RedefinirSenhaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <FormularioRedefinicao />
        </Suspense>
    );
}