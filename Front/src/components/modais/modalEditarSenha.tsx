"use client";

import { useState } from 'react';
import { 
  ArrowLeftIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import api from '@/utils/api';
import { toast } from 'sonner';

const alterarSenhaRequest = async (senhaAntiga: string, senhaNova: string) => {
  try {
    const response = await api.patch('/auth/mudar-senha', {
      senhaAntiga,
      senhaNova
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao alterar senha:", error);
    throw new Error(error.response?.data?.message || "Erro ao alterar senha.");
  }
};

interface modalEditarSenhaProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function modalEditarSenha({ isOpen, onClose }: modalEditarSenhaProps) {
  
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [loading, setLoading] = useState(false);

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const calcularForcaSenha = (pass: string) => {
    let pontuacao = 0;
    if (!pass) return 0;
    if (pass.length >= 8) pontuacao++;      // Critério 1: Tamanho
    if (/[A-Z]/.test(pass)) pontuacao++;    // Critério 2: Maiúscula
    if (/[0-9]/.test(pass)) pontuacao++;    // Critério 3: Número
    if (/[^A-Za-z0-9]/.test(pass)) pontuacao++; // Critério 4: Símbolo
    return pontuacao;
  };

  const forcaSenha = calcularForcaSenha(novaSenha);

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

  const limparCampos = () => {
    setSenhaAntiga('');
    setNovaSenha('');
    setConfirmarSenha('');
    setLoading(false);
  };

  const handleClose = () => {
    limparCampos();
    onClose();
  };

  const handleSubmit = async () => {
    if (!senhaAntiga || !novaSenha || !confirmarSenha) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (novaSenha.length < 8) {
        toast.error('A nova senha precisa ter no mínimo 8 caracteres.');
        return;
    }
    if (!/[A-Z]/.test(novaSenha)) {
        toast.error('A nova senha precisa ter pelo menos uma letra maiúscula.');
        return;
    }
    if (!/[0-9]/.test(novaSenha)) {
        toast.error('A nova senha precisa ter pelo menos um número.');
        return;
    }
    if (!/[^A-Za-z0-9]/.test(novaSenha)) {
        toast.error('A nova senha precisa ter pelo menos um símbolo.');
        return;
    }

    setLoading(true);

    try {
      await alterarSenhaRequest(senhaAntiga, novaSenha);
      toast.success("Senha alterada com sucesso!");
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar senha.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={handleClose}
      className='fixed inset-0 z-999999 bg-black/40 flex items-center justify-center'
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className='pointer-events-auto relative flex flex-col items-center w-[600px] max-w-[95%] max-h-screen overflow-y-auto rounded-2xl bg-white shadow-xl border p-8 [&::-webkit-scrollbar]:hidden'
      >
        
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 left-6 text-black hover:text-gray-600 transition-colors"
        >
          <ArrowLeftIcon className="size-8" />
        </button>

        <h1 className='text-[28px] text-texto-primario font-(--fonte-primaria) mb-8 mt-2'>
            Alterar Senha
        </h1>
        
        <div className="w-full max-w-sm flex flex-col gap-5">
            
            <div className="w-full">
                <label className="text-sm font-semibold text-gray-700 mb-1 ml-1 block">Senha Atual</label>
                <div className="relative">
                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-azul-dark" />
                    <input 
                        type={mostrarSenha ? "text" : "password"}
                        placeholder="Digite sua senha atual"
                        value={senhaAntiga}
                        onChange={(e) => setSenhaAntiga(e.target.value)}
                        className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-azul-principal text-gray-800 placeholder-azul-dark/50"
                    />
                    <button 
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-azul-principal"
                    >
                        {mostrarSenha ? <EyeSlashIcon className="size-5"/> : <EyeIcon className="size-5"/>}
                    </button>
                </div>
            </div>

            <div className="w-full">
                <label className="text-sm font-semibold text-gray-700 mb-1 ml-1 block">Nova Senha</label>
                <div className="relative">
                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-azul-dark" />
                    <input 
                        type={mostrarSenha ? "text" : "password"}
                        placeholder="Digite a nova senha"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-azul-principal text-gray-800 placeholder-azul-dark/50"
                    />
                </div>
            </div>

            {novaSenha && (
                <div className="w-full -mt-2 px-1">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Força da senha:</span>
                        <span className={`text-xs font-bold ${infoForca.label === 'Fraca' ? 'text-red-500' : infoForca.label === 'Média' ? 'text-yellow-500' : infoForca.label === 'Boa' ? 'text-blue-500' : 'text-green-600'}`}>
                            {infoForca.label}
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${infoForca.color} transition-all duration-500 ease-out`} 
                            style={{ width: infoForca.width === 'w-1/4' ? '25%' : infoForca.width === 'w-2/4' ? '50%' : infoForca.width === 'w-3/4' ? '75%' : '100%' }}
                        ></div>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className={`text-[10px] px-2 py-1 rounded-full ${novaSenha.length >= 8 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>8+ Caracteres</span>
                        <span className={`text-[10px] px-2 py-1 rounded-full ${/[A-Z]/.test(novaSenha) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>Maiúscula</span>
                        <span className={`text-[10px] px-2 py-1 rounded-full ${/[0-9]/.test(novaSenha) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>Número</span>
                        <span className={`text-[10px] px-2 py-1 rounded-full ${/[^A-Za-z0-9]/.test(novaSenha) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>Símbolo</span>
                    </div>
                </div>
            )}

            <div className="w-full">
                <label className="text-sm font-semibold text-gray-700 mb-1 ml-1 block">Confirmar Nova Senha</label>
                <div className="relative">
                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-azul-dark" />
                    <input 
                        type={mostrarSenha ? "text" : "password"}
                        placeholder="Confirme a nova senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        className={`w-full pl-12 pr-10 py-3 border rounded-xl focus:outline-none focus:border-azul-principal text-gray-800 placeholder-azul-dark/50
                            ${confirmarSenha && novaSenha !== confirmarSenha ? 'border-red-500' : 'border-gray-300'}
                        `}
                    />
                </div>
                 {confirmarSenha && novaSenha !== confirmarSenha && (
                    <p className="text-xs text-red-500 mt-1 ml-1">As senhas não coincidem</p>
                )}
            </div>

            <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center justify-center border border-azul-dark rounded-xl py-3 mt-6 bg-azul-principal w-full text-white hover:bg-[#254c9b] transition font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
            </button>

        </div>
      </div>
    </div>
  );
}