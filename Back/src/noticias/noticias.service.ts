import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { NoticiasDto } from './dto/noticias.dto';
import { EdicaoNoticiasDto } from './dto/edicao.noticias.dto';
import { PrismaService } from 'src/prisma/prisma.service'; 

@Injectable()
export class NoticiasService {
    constructor(private readonly prismaService: PrismaService) {}

    async criarNoticia(idUsuario: number, data: NoticiasDto) {
        return this.prismaService.noticia.create({
            data: {
                ...data, 
                idUsuario: idUsuario, 
            },
        });
    }

    async editarNoticia(idNoticia: number, idUsuario: number, data: EdicaoNoticiasDto) {

        const noticia = await this.prismaService.noticia.findUnique({
            where: { id: idNoticia },
        });

        if (!noticia) {
            throw new NotFoundException(`Notícia com ID ${idNoticia} não encontrada.`);
        }

        if (noticia.idUsuario !== idUsuario) {
            throw new ForbiddenException('Você não tem permissão para editar esta notícia.');
        }

        return this.prismaService.noticia.update({
            where: { id: idNoticia },
            data,
        });
    }

    async desativarDenuncia(idNoticia: number, idUsuario: number, tipoUsuario: string) {

        const noticia = await this.prismaService.noticia.findUnique({
            where: { id: idNoticia },
        });

        if (!noticia) {
            throw new NotFoundException(`Notícia com ID ${idNoticia} não encontrada.`);
        }

        const isOwner = noticia.idUsuario === idUsuario;
        const isAdmin = tipoUsuario === 'ADMIN'; 

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException('Você não tem permissão para desativar esta notícia.');
        }

        return this.prismaService.noticia.update({
            where: { id: idNoticia },
            data: { desativada: true, dataDesativacao: new Date() }, 
        });
    }

    async deletarDenuncia(idNoticia: number, idUsuario: number, tipoUsuario: string) {

        const noticia = await this.prismaService.noticia.findUnique({
            where: { id: idNoticia },
        });

        if (!noticia) {
            throw new NotFoundException(`Notícia com ID ${idNoticia} não encontrada.`);
        }

        const isAdmin = tipoUsuario === 'ADMIN'; 

        if (!isAdmin) {
            throw new ForbiddenException('Você não tem permissão para deletar permanentemente esta notícia.');
        }

        return this.prismaService.noticia.delete({
            where: { id: idNoticia },
        });
    }
}