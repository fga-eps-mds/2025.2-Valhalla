import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { DenunciaDto } from './dto/denuncia.dto';
import { edicaoDenunciaDto } from './dto/edicao.denuncia.dto';

@Injectable()
export class DenunciasService{

    constructor (private prisma: PrismaService){}

    async criarDenuncia (data: DenunciaDto){
        const criacaoDenuncia = await this.prisma.denuncia.create({
            data: {
                idUsuario: data.idUsuario,
                descricao: data.descricao,
                idCategoria: data.idCategoria,
                mediasrc: data.mediasrc,
                anonimato: data.anonimato,
            }});
        return criacaoDenuncia;
    }

    async editarDenuncia (id: number,data: edicaoDenunciaDto){
        const existeDenuncia = await this.prisma.denuncia.findUnique({
            where: { id },
        })
        if (!existeDenuncia) {
            throw new Error('Denúncia não encontrada!');
        }
        return await this.prisma.denuncia.update({
            where: { id },
            data: {
                descricao: data.descricao,
                idCategoria: data.idCategoria,
                mediasrc: data.mediasrc,
                anonimato: data.anonimato,
            },
        });
    }

    async deletarDenunciaPermanente (id: number){
        const existeDenuncia = await this.prisma.denuncia.findUnique({
            where: { id },
        })
        if (!existeDenuncia) {
            throw new Error('Denúncia não encontrada!');
        }
        return await this.prisma.denuncia.delete({
            where: { id },
        });
    }

    async deletarDenuncia (id: number, data: edicaoDenunciaDto){
        const existeDenuncia = await this.prisma.denuncia.findUnique({
            where: { id },
        })
        if (!existeDenuncia) {
            throw new Error('Denúncia não encontrada!');
        }
        return await this.prisma.denuncia.update({
            where: { id },
            data: {
                descricao: data.descricao,
                idCategoria: data.idCategoria,
                mediasrc: data.mediasrc,
                anonimato: data.anonimato,
                dataDelete: new Date(),
            },
        });
    }

}