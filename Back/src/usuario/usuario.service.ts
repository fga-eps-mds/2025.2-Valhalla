import { Injectable } from '@nestjs/common';
import { CriacaoUsuarioDto } from './dto/usuario.dto';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { EdicaoUsuarioDto } from './dto/edicao.usuario.dto';
import { CargoUsuario, TipoUsuario } from '@prisma/client';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';

const usuarioSelect = {
    id: true,
    nome: true,
    email: true,
    cargo: true,
    tipo: true,
    mediaSrc: true,
    dataCriacao: true,
    dataUpdate: true,
    dataDelete: true,
};

@Injectable()
export class UsuarioService {
    
constructor(private prisma: PrismaService) {}


    async criarUsuario(DadosUsuario: CriacaoUsuarioDto, UsuarioSolicitante?: {tipo: TipoUsuario}) {

        if (DadosUsuario.tipo && DadosUsuario.tipo !== TipoUsuario.COMUM) {

            if (!UsuarioSolicitante) {
                throw new ForbiddenException("Ação não autorizada!");
            }

            if (UsuarioSolicitante.tipo !== TipoUsuario.ADMINMASTER) {
                throw new ForbiddenException("Ação não autorizada! Somente ADMINMASTER pode criar usuários com privilégios elevados.");
            }
        }

        const existeAdminMaster = await this.prisma.usuario.findFirst({
            where: { tipo: TipoUsuario.ADMINMASTER }
        });

        if (existeAdminMaster !== null && DadosUsuario.tipo === TipoUsuario.ADMINMASTER) {
            throw new ForbiddenException("Já existe um ADMINMASTER cadastrado no sistema!");
        }

        const SenhaHash = await bcrypt.hash(DadosUsuario.senha, 10 )

        const { dataCriacao, dataUpdate, dataDelete, ...usuarioSemData } = usuarioSelect;
        
        try {
        return await this.prisma.usuario.create({
            data:{
                nome: DadosUsuario.nome,
                email: DadosUsuario.email,
                senha: SenhaHash,
                cargo: DadosUsuario.cargo as CargoUsuario,
                tipo: DadosUsuario.tipo as TipoUsuario,
                mediaSrc: DadosUsuario.mediaSrc,
            },
            select: usuarioSemData,
        });
        
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email já está em uso!');
            }
            throw new Error('Erro ao criar usuário: ' + error.message);
        }
    }

    async deletarUsuario(idUsuario: number, idAlvo: number, idTipo: TipoUsuario){
        await this.definirHierarquia(idUsuario, idAlvo, idTipo);
        return await this.prisma.usuario.delete({where: {id: idAlvo}});
    }


    async desativarUsuario(idUsuario: number, idAlvo: number, idTipo: TipoUsuario){
        await this.definirHierarquia(idUsuario, idAlvo, idTipo);
        if (await this.prisma.usuario.findUnique({where: {id: idAlvo, dataDelete: {not: null}}})){
            throw new NotFoundException("Usuário não encontrado!");
        }
        return await this.prisma.usuario.update({where: {id: idAlvo,}, data: {dataDelete: new Date()}});
    }
    

    async listarUsuario() {
        const usuarios = await this.prisma.usuario.findMany({where: {dataDelete: null}, select: usuarioSelect});
        return usuarios;
    }
    

    async encontrarUsuario(id: number){
        
        const usuario = await this.prisma.usuario.findUnique({where:{id}, select: usuarioSelect});
        
        if(!usuario) {
            throw new NotFoundException("Usuário não encontrado!")
        }

        if(usuario.dataDelete !== null) {
            throw new NotFoundException("Usuário não encontrado!")
        }

        return usuario;
    }


    async editarUsuario(id:number, data: EdicaoUsuarioDto, editarSenha?: {senha: boolean}) {
        
        const usuario = await this.prisma.usuario.findUnique({
            where:{ id }
        })
        
        if(!usuario || usuario.dataDelete !== null) {
            throw new NotFoundException("Usuário não encontrado!")
        }

        if (!editarSenha?.senha && data.senha) {
            delete data.senha;
            throw new ForbiddenException("Ação não autorizada! Para editar a senha, utilize o meio apropriado.");
        }

        try {
        return await this.prisma.usuario.update({
            where:{ id },
            data,
            select: usuarioSelect,
        }); 
        }catch (error) {
            // Tratamento de e-mail duplicado na edição
            if (error.code === 'P2002') {
                throw new ConflictException('Este e-mail já está em uso por outro usuário.');
            }
            throw error;
        }
    }


    async procurarPorEmail(email: string) {
        return this.prisma.usuario.findFirst({ where: { email, dataDelete: null } });
    }

    async encontrarUsuarioAuth(id: number){
        
        const usuario = await this.prisma.usuario.findUnique({where:{id}});
        
        if(!usuario) {
            throw new NotFoundException("Usuário não encontrado!")
        }

        return usuario;
    }

    private async definirHierarquia(idUsuario: number, idAlvo: number, idTipo: TipoUsuario){
        
        const UsuarioAlvo = await this.prisma.usuario.findUnique({
            where: {
                id: idAlvo,
            }
        });

        if (!UsuarioAlvo) {
            throw new NotFoundException("Usuário Não Encontrado!")
        }

        if (idUsuario === idAlvo && idTipo !== TipoUsuario.ADMINMASTER ) {
            return true;
        }

        switch (idTipo){
            case TipoUsuario.COMUM :
                throw new ForbiddenException("Ação não autorizada! Não possui privilégios suficientes.");

            case TipoUsuario.ADMIN :
                if (UsuarioAlvo.tipo === TipoUsuario.ADMINMASTER){
                    throw new ForbiddenException("Ação não autorizada! Não possui privilégios suficientes.");
                }
                if (UsuarioAlvo.tipo === TipoUsuario.ADMIN && UsuarioAlvo.id !== idUsuario){
                    throw new ForbiddenException("Ação não autorizada! Não possui privilégios suficientes.");
                }
                if (UsuarioAlvo.tipo === TipoUsuario.COMUM){
                    return true;
                }
                break;

            case TipoUsuario.ADMINMASTER :
                if (idUsuario === idAlvo){ 
                    throw new ForbiddenException("Ação não autorizada! Admin Master não pode ser deletado");
                }
                if (UsuarioAlvo.tipo !== TipoUsuario.ADMINMASTER){
                    return true;
                }
                break;

            default:
                throw new ForbiddenException("Ação não autorizada!");
        }

        throw new ForbiddenException("Ação não autorizada!");
    }
}