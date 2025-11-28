'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/utils/api';
import { CargoUsuario } from '../../../types';


import { 
    AcademicCapIcon, 
    UserCircleIcon, 
    KeyIcon, 
    ChevronUpDownIcon,
    ShieldCheckIcon,
    ArrowRightEndOnRectangleIcon, 
    ArrowLeftIcon,
    EyeIcon,
    EyeSlashIcon
} from '@heroicons/react/24/outline';

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [cargo, setCargo] = useState<CargoUsuario | ''>('');
    const [termosAceitos, setTermosAceitos] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false); 
    const [loading, setLoading] = useState(false); 

    const router = useRouter();

    const calcularForcaSenha = (pass: string) => {
        let pontuacao = 0;
        if (!pass) return 0;
        if (pass.length >= 8) pontuacao++;
        if (/[A-Z]/.test(pass)) pontuacao++;
        if (/[0-9]/.test(pass)) pontuacao++;
        if (/[^A-Za-z0-9]/.test(pass)) pontuacao++;
        return pontuacao;
    };

    const forcaSenha = calcularForcaSenha(senha);

    const getForcaInfo = () => {
        switch (true) {
            case forcaSenha < 2: return { label: 'Fraca', color: 'bg-red-500', width: 'w-1/4' };
            case forcaSenha < 3: return { label: 'Média', color: 'bg-yellow-400', width: 'w-2/4' };
            case forcaSenha < 4: return { label: 'Boa', color: 'bg-blue-500', width: 'w-3/4' };
            case forcaSenha === 4: return { label: 'Forte', color: 'bg-green-500', width: 'w-full' };
            default: return { label: '', color: 'bg-gray-200', width: 'w-0' };
        }
    };
    const infoForca = getForcaInfo();
    

    const validarNome = (nome: string) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome.trim());
    const validarEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !email || !senha || !confirmaSenha || !cargo) {
            toast.error('Por favor, preencha todos os campos.');
            return;
        }
        if (!validarNome(nome)) {
            toast.error('O nome deve conter apenas letras e espaços.');
            return;
        }
        if (!validarEmail(email)) {
            toast.error('Por favor, insira um email válido.');
            return;
        }
        if (!termosAceitos) {
            toast.error('Você deve aceitar os termos de uso para continuar.');
            return;
        }

        if (senha !== confirmaSenha) {
            toast.error('As senhas não coincidem.');
            return;
        }
        if (senha.length < 8) {
            toast.error('A senha precisa ter no mínimo 8 caracteres.');
            return;
        }
        if (!/[A-Z]/.test(senha)) {
            toast.error('A senha precisa ter pelo menos uma letra maiúscula.');
            return;
        }
        if (!/[0-9]/.test(senha)) {
            toast.error('A senha precisa ter pelo menos um número.');
            return;
        }
        if (!/[^A-Za-z0-9]/.test(senha)) {
            toast.error('A senha precisa ter pelo menos um símbolo.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/usuarios', {
                nome,
                email,
                senha,
                cargo
            });
            toast.success("Cadastro realizado com sucesso! Faça login.");
            router.push('/login');
        } catch (error: any) {
            const mensagemErro = error.response?.data?.message || 'Erro ao realizar cadastro.';
            const msgFinal = Array.isArray(mensagemErro) ? mensagemErro[0] : mensagemErro;
            toast.error(msgFinal);
            console.error('Log de Erro:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="w-[640px] min-h-[730px] rounded-2xl bg-white border border-gray-200 shadow-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-8">
                
                <Link href="/" className="absolute top-6 left-6">
                    <ArrowLeftIcon className="w-10 h-10 text-[#1A2A4A] cursor-pointer hover:text-[#3060BF] transition" />
                </Link>

                <Image 
                    src="/logos/Corujuda.svg"
                    alt="Logo do Guardiões da Universidade"
                    width={140}
                    height={140}
                    className="mb-4 mt-2"
                />
                
                <h1 className='text-[36px] font-bold text-[#050505] font-[var(--fonte-primaria)] mb-8'>
                    Cadastro
                </h1>

                <form onSubmit={handleSubmit} className='w-full max-w-sm flex flex-col gap-4'>
                    
                    <div className='relative'>
                        <UserCircleIcon className='absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#1A2A4A]'/>
                        <input 
                            type="text" 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder='Nome Completo'
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#3060BF] text-gray-800 placeholder-[#1A2A4A]/50"
                        />
                    </div>
                    
                    <div className='relative'>
                        <AcademicCapIcon className='absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#1A2A4A]'/>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email Institucional'
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#3060BF] text-gray-800 placeholder-[#1A2A4A]/50"
                        />
                    </div>
                    
                    <div className='relative'>
                        <KeyIcon className='absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#1A2A4A]'/>
                        <input 
                            type={mostrarSenha ? "text" : "password"}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder='Senha'
                            className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#3060BF] text-gray-800 placeholder-[#1A2A4A]/50"
                        />
                        <button 
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3060BF]"
                        >
                            {mostrarSenha ? <EyeSlashIcon className="size-5"/> : <EyeIcon className="size-5"/>}
                        </button>
                    </div>

                    {senha && (
                        <div className="w-full -mt-2 px-1 mb-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500">Força da senha:</span>
                                <span className={`text-xs font-bold ${infoForca.label === 'Fraca' ? 'text-red-500' : infoForca.label === 'Média' ? 'text-yellow-500' : infoForca.label === 'Boa' ? 'text-blue-500' : 'text-green-600'}`}>
                                    {infoForca.label}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                                <div 
                                    className={`h-full ${infoForca.color} transition-all duration-500 ease-out`} 
                                    style={{ width: infoForca.width === 'w-1/4' ? '25%' : infoForca.width === 'w-2/4' ? '50%' : infoForca.width === 'w-3/4' ? '75%' : '100%' }}
                                ></div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className={`text-[10px] px-2 py-1 rounded-full ${senha.length >= 8 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>8+ chars</span>
                                <span className={`text-[10px] px-2 py-1 rounded-full ${/[A-Z]/.test(senha) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>Maiúscula</span>
                                <span className={`text-[10px] px-2 py-1 rounded-full ${/[0-9]/.test(senha) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>Número</span>
                                <span className={`text-[10px] px-2 py-1 rounded-full ${/[^A-Za-z0-9]/.test(senha) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>Símbolo</span>
                            </div>
                        </div>
                    )}
                    
                    <div className='relative'>
                        <KeyIcon className='absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#1A2A4A]'/>
                        <input 
                            type={mostrarSenha ? "text" : "password"}
                            value={confirmaSenha}
                            onChange={(e) => setConfirmaSenha(e.target.value)}
                            placeholder='Confirmar Senha'
                            className={`w-full pl-12 pr-10 py-3 border rounded-xl focus:outline-none focus:border-[#3060BF] text-gray-800 placeholder-[#1A2A4A]/50
                                ${confirmaSenha && senha !== confirmaSenha ? 'border-red-500' : 'border-gray-300'}
                            `}
                        />
                    </div>
                    {confirmaSenha && senha !== confirmaSenha && (
                        <p className="text-xs text-red-500 -mt-2 ml-1">As senhas não coincidem</p>
                    )}
                    
                    <div className='relative'>
                        <ChevronUpDownIcon className='absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#1A2A4A]'/>
                        <select 
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value as CargoUsuario)}
                            className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#3060BF] text-gray-800 bg-white appearance-none cursor-pointer'
                        >
                            <option value="" disabled>Selecione sua Ocupação</option>
                            <option value="ESTUDANTE">Estudante</option>
                            <option value="SERVIDOR">Servidor</option>
                            <option value="OUTRO">Outro</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center border border-[#1A2A4A] rounded-xl py-3 mt-4 gap-2 bg-[#3060BF] w-full text-white hover:bg-[#254c9b] transition font-bold shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
                        {!loading && <ArrowRightEndOnRectangleIcon className='size-5'/>}
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-2">
                        <input 
                            type="checkbox" 
                            id="termos"
                            checked={termosAceitos}
                            onChange={() => setTermosAceitos(!termosAceitos)}
                            className="w-5 h-5 accent-[#3060BF] cursor-pointer" 
                        />
                        <label htmlFor="termos" className="text-sm text-gray-600 cursor-pointer select-none">
                            Li e aceito os <a href="#" className="text-[#3060BF] underline hover:text-[#254c9b]">termos de uso</a>
                        </label>
                        <ShieldCheckIcon className='size-5 text-[#3060BF]'/>
                    </div>

                </form>
            </div>
        </>
    );
}