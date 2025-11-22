import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { DenunciaDto } from './dto/denuncia.dto';
import { edicaoDenunciaDto } from './dto/edicao.denuncia.dto';

@Injectable()
export class DenunciasService{

    constructor (private prisma: PrismaService){}

    async criarDenuncia (idUsuario: number, data: DenunciaDto){
        const criacaoDenuncia = await this.prisma.denuncia.create({
            data: {
                idUsuario: idUsuario,
                descricao: data.descricao,
                idCategoria: data.idCategoria,
                mediaSrc: data.mediaSrc,
                anonimato: data.anonimato,
            }});
        return criacaoDenuncia;
    }

    async editarDenuncia (id: number, idUsuario: number, data: edicaoDenunciaDto){
        const existeDenuncia = await this.prisma.denuncia.findUnique({
            where: { id },
        })
        if (!existeDenuncia) {
            throw new Error('Denúncia não encontrada!');
        }
        
        if (existeDenuncia.idUsuario !== idUsuario) {
            throw new Error('Usuário não autorizado a editar esta denúncia!');
        }

        return await this.prisma.denuncia.update({
            where: { id },
            data: {
                descricao: data.descricao,
                idCategoria: data.idCategoria,
                mediaSrc: data.mediaSrc,
                anonimato: data.anonimato,
            },
        });
    }

    async deletarDenuncia (id: number, idUsuario: number){
        const existeDenuncia = await this.prisma.denuncia.findUnique({
            where: { id },
        })
        if (!existeDenuncia) {
            throw new Error('Denúncia não encontrada!');
        }
        
        if (existeDenuncia.idUsuario !== idUsuario) {
            throw new Error('Usuário não autorizado a deletar esta denúncia!');
        }
        
        return await this.prisma.denuncia.delete({
            where: { id },
        });
    }

    async desativarDenuncia (id: number, idUsuario: number){
        const existeDenuncia = await this.prisma.denuncia.findUnique({
            where: { id },
        })
        if (!existeDenuncia) {
            throw new Error('Denúncia não encontrada!');
        }

        if (existeDenuncia.idUsuario !== idUsuario) {
            throw new Error('Usuário não autorizado a deletar esta denúncia!');
        }
        
        return await this.prisma.denuncia.update({
            where: { id },
            data: {
                dataDelete: new Date(),
            },
        });
    }

    async encontrarDenuncia(id: number) {
        if (!id) {
            throw new Error('Denuncia não Encontrada!');
        }
        return this.prisma.denuncia.findUnique({
            where: { id },
        });
    }

    async listarDenuncias() {
        return this.prisma.denuncia.findMany();
    }

}