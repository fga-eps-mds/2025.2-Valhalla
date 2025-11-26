'use client';

import { AcademicCapIcon, UserCircleIcon, KeyIcon, ChevronUpDownIcon,ShieldCheckIcon,ArrowRightEndOnRectangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CargoUsuario } from '../../../types';
import { toast } from 'sonner';
import api from '@/utils/api';


export default function Cadastro() {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [cargo, setCargo] = useState<CargoUsuario | ''>('');

    const [termosAceitos, setTermosAceitos] = useState(false);

    const [erro, setErro] = useState<string | null>(null);
    const router = useRouter();

    // --- Funções de Validação ---
    const validarNome = (nome: string) => {
        const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
        return regex.test(nome.trim());
    };
    
    const validarEmail = (email: string) => {
        const regexFormato = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regexFormato.test(email.trim());
    };

    const validarSenhaSegura = (senha: string) => {
        // Regex inclui: 8+ chars, maiúscula (Ç), minúscula (ç), número, especial (@$!%*?&.)
        const regex = /^(?=.*[a-zç])(?=.*[A-ZÇ])(?=.*\d)(?=.*[@$!%*?&.]).{8,}$/;
        return regex.test(senha);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Botão CADASTRAR clicado!");
    
    // Validações em ordem, usando toasts para feedback de erro
    if (!nome || !email || !senha || !confirmaSenha || !cargo) {
      toast.error('Por favor, preencha todos os campos.', { id: 'err-campos' });
      return;
    }
    
    if (!validarNome(nome)) {
      toast.error('O nome deve conter apenas letras e espaços.', { id: 'err-nome' });
      return;
    }

    if (!validarEmail(email)) {
      toast.error('Por favor, insira um email válido.', { id: 'err-email' });
      return;
    }
    if (senha !== confirmaSenha) {
      toast.error('As senhas não coincidem.', { id: 'err-match' });
      return;
    }
    if (!validarSenhaSegura(senha)) {
      toast.error('Senha inválida. Deve ter 8+ caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial (ex: @$!%*?&.).', { id: 'err-segura' });
      return;
    }
    
    return handleCadastro();
  };

    const handleCadastro = async () => {

        console.log('Iniciando cadastro para:', { nome });

        try {
            await api.post('/usuarios', {
                nome,
                email,
                senha,
                cargo
            });
            router.push('/login');

        } catch (error: any) {

            const dadosDoErro = error.response?.data;


            let mensagemFinal = 'Erro ao conectar com o servidor.';


            if (dadosDoErro?.message) {

                if (Array.isArray(dadosDoErro.message)) {
                    mensagemFinal = dadosDoErro.message[0];
                } 

                else {
                    mensagemFinal = dadosDoErro.message;
                }
            }

            toast.error(mensagemFinal);
            console.error('Log de Erro:', error);
        }
    };

    return (
        <>
        <div className="w-[640px] h-[730px] rounded-2xl opacity-80 shadow-[0_0.25rem_0.25rem_0_rgba(0,0,0,0.25)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">   
            <Link href="/" className="absolute top-6 left-6">
                <ArrowLeftIcon className="w-12 h-12 text-azul-dark cursor-pointer hover:text-azul-principal transition" />
            </Link>

            <Image 
            src="/logos/Corujuda-Contorno.svg"
            alt="Logo do Guardiões da Universidade."
            width={160}
            height={160}
            className=""
            />
            <h1 className='text-[36px] text-texto-primario style={{fontFamily: "var(--fonte-primaria)"}} mb-[43px]'>Cadastro</h1>

            <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-2.5 w-full h-[440px]' >
                
                <div className='flex items-center p-[13px_15px] border border-bordas rounded-[15px] w-[440px] h-[50px]'>
                    <AcademicCapIcon className='size-5'/>
                    <input type="name" 
                    id="name" 
                    value={nome}
                    onChange= {(e) => setNome(e.target.value)}
                    placeholder='Digite aqui seu Nome'
                    className="w-full outline-none px-[9px] placeholder-secundaria text-texto-corpo"
                    />
                </div>
                
                <div className='flex items-center p-[13px_15px] border border-bordas rounded-[15px] w-[440px] h-[50px]'>
                    <UserCircleIcon className='size-5'/>
                    <input type="email" 
                    id="email" 
                    value={email}
                    onChange= {(e) => setEmail(e.target.value)}
                    placeholder='Digite aqui seu Email'
                    className="w-full outline-none px-[9px] placeholder-secundaria text-texto-corpo"
                    />
                </div>
                
                <div className='flex items-center p-[13px_15px] border border-bordas rounded-[15px] w-[440px] h-[50px]'>
                    <KeyIcon className='size-5'/>
                    <input type="password" 
                    id="password"
                    value={senha}
                    onChange= {(e) => setSenha(e.target.value)}
                    placeholder='Digite aqui sua Senha'
                    className="w-full outline-none px-[9px] placeholder-secundaria text-texto-corpo"
                    />
                </div>
                
                <div className='flex items-center p-[13px_15px] border border-bordas rounded-[15px] w-[440px] h-[50px]'>
                    <KeyIcon className='size-5'/>
                    <input type="password" 
                    id="password"
                    value={confirmaSenha}
                    onChange= {(e) => setConfirmaSenha(e.target.value)}
                    placeholder='Digite aqui sua Senha'
                    className="w-full outline-none px-[9px] placeholder-secundaria text-texto-corpo"
                    />
                </div>
                
                <div className='flex items-center p-[13px_15px] border border-bordas rounded-[15px] w-[440px] h-[50px]'>
                    <ChevronUpDownIcon className='size-5'/>
                    <select 
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value as CargoUsuario)}
                        className='w-full outline-none px-[9px]'>
                        <option value="" disabled selected>Selecione sua Ocupação</option>
                        <option value="ESTUDANTE" >Estudante</option>
                        <option value="SERVIDOR" >Servidor</option>
                        <option value="OUTRO" >Outro</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center border border-azul-dark rounded-[15px] py-[11px] my-[38px] gap-[5px] bg-azul-principal w-60 h-[45px] text-white hover:bg-azul-light transition">
                    CADASTRAR
                    <ArrowRightEndOnRectangleIcon className='size-5'/>
                </button>
            </form>


        
            <div className="flex items-center gap-2 mb-[50px]">
                <input 
                type="checkbox" 
                id="termos"
                checked={termosAceitos}
                onChange={() => setTermosAceitos(!termosAceitos)}
                className="w-5 h-5 bg-azul-principal" />
                <label htmlFor="termos" className="text-sm text-texto-corpo">
                    Declaro que li e aceito os <a href="#" className="text-azul-principal underline">termos de uso</a>
                </label>
                <ShieldCheckIcon className='size-6'/>
            </div>
        </div>
        </>
    )
}