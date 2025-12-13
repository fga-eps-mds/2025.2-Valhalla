'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import Link from "next/link";
import { toast } from 'sonner';
import api from '@/utils/api'; 
import { 
    UserCircleIcon, 
    KeyIcon, 
    ArrowRightEndOnRectangleIcon, 
    ArrowLeftIcon,
    EyeIcon,
    EyeSlashIcon,
    TrashIcon,
    ShieldCheckIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

interface UsuarioAdmin {
    id: string | number;
    nome: string;
    email: string;
    cargo: string;
    tipo: string;
}

export default function GerenciarAdmins() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false); 
    const [loading, setLoading] = useState(false); 

    const [listaAdmins, setListaAdmins] = useState<UsuarioAdmin[]>([]);
    const [loadingLista, setLoadingLista] = useState(true);

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


    const fetchAdmins = useCallback(async () => {
        try {
            const response = await api.get('/usuarios'); 
            
            console.log("Resposta da API:", response.data);
            const listaBruta = Array.isArray(response.data) 
                ? response.data 
                : (response.data.usuarios || response.data.data || response.data.users || []);

            if (!Array.isArray(listaBruta)) {
                console.error("Formato inesperado:", response.data);
                toast.error("Erro no formato dos dados recebidos.");
                return;
            }

            const adminsFiltrados = listaBruta.filter((user: UsuarioAdmin) => user.tipo === 'ADMIN');
            
            setListaAdmins(adminsFiltrados);

        } catch (error) {
            console.error('Erro ao buscar admins:', error);
            toast.error('Erro ao carregar a lista de administradores.');
        } finally {
            setLoadingLista(false);
        }
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const handleDelete = async (id: string | number) => {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este administrador? Essa ação não pode ser desfeita.");
        if (!confirmacao) return;

        try {
            await api.delete(`/usuarios/${id}`);
            toast.success("Administrador removido com sucesso.");
            fetchAdmins(); 
        } catch (error) {
            console.error(error);
            toast.error("Erro ao excluir administrador.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !email || !senha || !confirmaSenha) {
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
            await api.post('/usuarios/admin', {
                nome,
                email,
                senha,
                tipo: 'ADMIN',
                cargo: 'OUTRO' 
            });
            
            toast.success("Novo administrador criado com sucesso!");
            
            setNome('');
            setEmail('');
            setSenha('');
            setConfirmaSenha('');
            
            fetchAdmins();

        } catch (error: any) {
            const mensagemErro = error.response?.data?.message || 'Erro ao criar administrador.';
            const msgFinal = Array.isArray(mensagemErro) ? mensagemErro[0] : mensagemErro;
            toast.error(msgFinal);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col gap-8">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/gerencia" className="p-2 rounded-full hover:bg-gray-200 transition">
                        <ArrowLeftIcon className="w-6 h-6 text-azul-dark" />
                    </Link>
                    <h1 className="text-3xl font-bold text-azul-dark">Gestão de Administradores</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUNA DA ESQUERDA: FORMULÁRIO DE CRIAÇÃO */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheckIcon className="w-8 h-8 text-azul-principal" />
                            <h2 className="text-xl font-bold text-texto-primario">Novo Admin</h2>
                        </div>

                        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                            
                            <div className='relative'>
                                <UserCircleIcon className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-azul-dark'/>
                                <input 
                                    type="text" 
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder='Nome Completo'
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-azul-principal text-sm text-gray-800 placeholder-azul-dark/50"
                                />
                            </div>
                            
                            <div className='relative'>
                                <EnvelopeIcon className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-azul-dark'/>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Email Institucional'
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-azul-principal text-sm text-gray-800 placeholder-azul-dark/50"
                                />
                            </div>
                            
                            <div className='relative'>
                                <KeyIcon className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-azul-dark'/>
                                <input 
                                    type={mostrarSenha ? "text" : "password"}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder='Senha'
                                    className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-azul-principal text-sm text-gray-800 placeholder-azul-dark/50"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-azul-principal"
                                >
                                    {mostrarSenha ? <EyeSlashIcon className="size-4"/> : <EyeIcon className="size-4"/>}
                                </button>
                            </div>

                            {senha && (
                                <div className="w-full px-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] text-gray-500">Força:</span>
                                        <span className={`text-[10px] font-bold ${infoForca.label === 'Fraca' ? 'text-red-500' : infoForca.label === 'Média' ? 'text-yellow-500' : infoForca.label === 'Boa' ? 'text-blue-500' : 'text-green-600'}`}>
                                            {infoForca.label}
                                        </span>
                                    </div>
                                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                                        <div 
                                            className={`h-full ${infoForca.color} transition-all duration-500 ease-out`} 
                                            style={{ width: infoForca.width === 'w-1/4' ? '25%' : infoForca.width === 'w-2/4' ? '50%' : infoForca.width === 'w-3/4' ? '75%' : '100%' }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                            
                            <div className='relative'>
                                <KeyIcon className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-azul-dark'/>
                                <input 
                                    type={mostrarSenha ? "text" : "password"}
                                    value={confirmaSenha}
                                    onChange={(e) => setConfirmaSenha(e.target.value)}
                                    placeholder='Confirmar Senha'
                                    className={`w-full pl-11 pr-10 py-3 border rounded-xl focus:outline-none focus:border-azul-principal text-sm text-gray-800 placeholder-azul-dark/50
                                        ${confirmaSenha && senha !== confirmaSenha ? 'border-red-500' : 'border-gray-300'}
                                    `}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center border border-azul-dark rounded-xl py-3 mt-2 gap-2 bg-azul-principal w-full text-white hover:bg-[#254c9b] transition font-bold shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                            >
                                {loading ? 'CRIANDO...' : 'CRIAR ADMINISTRADOR'}
                                {!loading && <ArrowRightEndOnRectangleIcon className='size-5'/>}
                            </button>

                        </form>
                    </div>
                </div>

                {/* COLUNA DA DIREITA: LISTA DE ADMINS */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-texto-primario mb-6">Administradores Cadastrados</h2>
                        
                        {loadingLista ? (
                            <div className="text-center py-10 text-gray-500 animate-pulse">Carregando lista...</div>
                        ) : listaAdmins.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">Nenhum outro administrador encontrado.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="p-4 text-sm font-semibold text-gray-600">Nome</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600 text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaAdmins.map((admin) => (
                                            <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-azul-principal/10 flex items-center justify-center text-azul-principal font-bold text-xs">
                                                            {admin.nome.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-gray-800 font-medium">{admin.nome}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-600 text-sm">{admin.email}</td>
                                                <td className="p-4 text-center">
                                                    <button 
                                                        onClick={() => handleDelete(admin.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                        title="Excluir Administrador"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}