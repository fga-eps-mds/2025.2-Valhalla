import { Injectable } from '@nestjs/common';
import { UsuarioDto } from './dto/usuario.dto';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { updateUsuarioDto } from './dto/edicao.usuario.dto';
import { CargoUsuario } from '@prisma/client';

@Injectable()
export class UsuarioService {

constructor(private prisma: PrismaService) {}

    async criarUsuario(DadosUsuario: UsuarioDto){
        const SenhaHash = await bcrypt.hash(DadosUsuario.senha, 10 )
        const CriacaoDeUsuario = await this.prisma.usuario.create({
            data:{
                nome: DadosUsuario.nome,
                email: DadosUsuario.email,
                senha: SenhaHash,
                cargo: DadosUsuario.cargo as CargoUsuario,
                mediasrc: DadosUsuario.mediasrc,
                isAdmin: false,
                admMaster: false
            },
        });
        const{senha, ...result} = CriacaoDeUsuario;
        return result;
        
    }

    async deletarUsuario(id: number){
        const UsuarioExiste = await this.prisma.usuario.findUnique({
            where: {
                id,
            }
        });

        if (!UsuarioExiste) {
            throw new Error("Usuário Não Encontrado!")
        }
        
        return await this.prisma.usuario.delete({
            where: {
                id,
            }
        })
    }

    async desativarUsuario(id: number){
        const UsuarioExiste = await this.prisma.usuario.findUnique({
            where: {
                id,
            }
        });

        if (!UsuarioExiste) {
            throw new Error("Usuário Não Encontrado!")
        }
        
        return await this.prisma.usuario.update({
            where: { id },
            data: {
                dataDelete: new Date()
            }
        })
    }
    
    async encontrarUsuario(id: number){
        if(!id) {
            throw new Error("Usuário não encontrado!")
        }

        return await this.prisma.usuario.findUnique({where:{id}})
    }
    
    async listarUsuario() {
        return this.prisma.usuario.findMany();
    }
    async editarUsuario(id:number, data: updateUsuarioDto){
        const usuario = await this.prisma.usuario.findUnique({
            where:{ id }
        })
        if(!usuario) {
            throw new Error("Usuário não encontrado!")
        }
        return await this.prisma.usuario.update({
            data,
            where:{ id }
        })
    }
    procurarPorEmail(email: string) {
    return this.prisma.usuario.findFirst({ where: { email } });
  }
}