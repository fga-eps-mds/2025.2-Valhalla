import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { NoticiasDto } from './dto/noticias.dto';
import { EdicaoNoticiasDto } from './dto/edicao.noticias.dto';
import { PrismaService } from 'src/database/prisma.service';

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

    async desativarNoticia(idNoticia: number, idUsuario: number, tipoUsuario: string) {

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
            data: {dataDelete: new Date() }, 
        });
    }

    async deletarNoticia(idNoticia: number, idUsuario: number, tipoUsuario: string) {

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

    async encontrarNoticia(id: number) {
        const denuncia = await this.prismaService.noticia.findUnique({
            where: { id },
        });
        
        if (!denuncia || denuncia.dataDelete) {
            throw new NotFoundException('Denuncia não Encontrada!');
        }
        return denuncia;
    }

    async listarNoticias(page: number, limit: number) {

        const skip = (page - 1) * limit;

        const denuncias = await this.prismaService.noticia.findMany({
            where: {dataDelete: null, usuario: {dataDelete: null}}, 
            orderBy: {id: 'desc'},
            skip: skip,
            take: limit,
            select: {
                id: true,
                descricao: true,
                mediaSrc: true,
                dataCriacao: true,
                dataUpdate: true,
                idUsuario: true,
                usuario: {
                    select: {
                        nome: true,
                        mediaSrc: true,
                    }
                },
            }
        });

        const totalDenuncias = await this.prismaService.noticia.count({
            where: {dataDelete: null, usuario: {dataDelete: null}},
        });

        return { denuncias, totalDenuncias };
    }

    async listarNoticiasPorUsuario(idUsuario: number, page: number, limit: number) {

        const skip = (page - 1) * limit;

        const denuncias = await this.prismaService.noticia.findMany({
            where: {dataDelete: null, idUsuario: idUsuario},
            orderBy: {id: 'desc'},
            skip: skip,
            take: limit,
            select: {
                id: true,
                descricao: true,
                mediaSrc: true,
                dataCriacao: true,
                dataUpdate: true,
                idUsuario: true,
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        mediaSrc: true,
                    }
                },
            }
        });
}}
