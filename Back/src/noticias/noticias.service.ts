import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { NoticiasDto } from './dto/noticias.dto';
import { EdicaoNoticiasDto } from './dto/edicao.noticias.dto';
import { PrismaService } from 'src/database/prisma.service';
import { TipoUsuario } from '@prisma/client';

@Injectable()
export class NoticiasService {
    
    constructor(private readonly prismaService: PrismaService) {}

    async criarNoticia(idUsuario: number, data: NoticiasDto, tipo: TipoUsuario) {
        if(tipo !== TipoUsuario.ADMIN && tipo !== TipoUsuario.ADMINMASTER) {
            throw new ForbiddenException('Apenas administradores podem criar notícias.');
        }
        return this.prismaService.noticia.create({
            data: {
                ...data, 
                idUsuario: idUsuario, 
            },
        });
    }

    async editarNoticia(idNoticia: number, idUsuario: number, data: EdicaoNoticiasDto, tipo: TipoUsuario) {
        await this.DefinirHierarquia(idNoticia, idUsuario, tipo);

        return this.prismaService.noticia.update({
            where: { id: idNoticia },
            data,
        });
    }

    async desativarNoticia(idNoticia: number, idUsuario: number, tipo: TipoUsuario) {
        await this.DefinirHierarquia(idNoticia, idUsuario, tipo);

        return this.prismaService.noticia.update({
            where: { id: idNoticia },
            data: { dataDelete: new Date() }, 
        });
    }

    // CORREÇÃO: Agora aceita TipoUsuario (Enum) em vez de string solta
    async deletarNoticia(idNoticia: number, idUsuario: number, tipoUsuario: TipoUsuario) {

        const noticia = await this.prismaService.noticia.findUnique({
            where: { id: idNoticia },
        });

        if (!noticia) {
            throw new NotFoundException(`Notícia com ID ${idNoticia} não encontrada.`);
        }

        // CORREÇÃO: Comparação segura com Enum
        const isAdmin = tipoUsuario === TipoUsuario.ADMIN || tipoUsuario === TipoUsuario.ADMINMASTER;

        if (!isAdmin) {
            throw new ForbiddenException('Você não tem permissão para deletar permanentemente esta notícia.');
        }

        return this.prismaService.noticia.delete({
            where: { id: idNoticia },
        });
    }

    async encontrarNoticia(id: number) {
        // CORREÇÃO: Nome da variável ajustado de 'denuncia' para 'noticia'
        const noticia = await this.prismaService.noticia.findUnique({
            where: { id },
        });
        
        if (!noticia || noticia.dataDelete) {
            throw new NotFoundException('Notícia não Encontrada!');
        }
        return noticia;
    }

    async listarNoticias(page: number, limit: number) {
        const skip = (page - 1) * limit;

        const noticias = await this.prismaService.noticia.findMany({
            where: { dataDelete: null, usuario: { dataDelete: null } }, 
            orderBy: { id: 'desc' },
            skip: skip,
            take: limit,
            select: {
                id: true,
                descricao: true,
                mediaSrc: true,
                dataCriacao: true,
                dataUpdate: true,
                idUsuario: true,
                tipo: true,
                usuario: {
                    select: {
                        nome: true,
                        mediaSrc: true,
                    }
                },
            }
        });

        const totalNoticias = await this.prismaService.noticia.count({
            where: { dataDelete: null, usuario: { dataDelete: null } },
        });

        // CORREÇÃO: Retorno agora é { noticias, totalNoticias }
        return { noticias, totalNoticias };
    }

    async listarNoticiasPorUsuario(idUsuario: number, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [noticias, totalNoticias] = await this.prismaService.$transaction([
            this.prismaService.noticia.findMany({
                where: { dataDelete: null, idUsuario: idUsuario },
                orderBy: { id: 'desc' },
                skip: skip,
                take: limit,
                select: {
                    id: true,
                    descricao: true,
                    mediaSrc: true,
                    dataCriacao: true,
                    dataUpdate: true,
                    idUsuario: true,
                    tipo: true,
                    usuario: {
                        select: {
                            id: true,
                            nome: true,
                            mediaSrc: true,
                        }
                    },
                }
            }),
             this.prismaService.noticia.count({
                where: { dataDelete: null, idUsuario: idUsuario },
            })
        ]);
        
        // CORREÇÃO: Retorno agora é { noticias, totalNoticias }
        return { noticias, totalNoticias };
    }  

    private async DefinirHierarquia(noticiaId: number, requisitorId: number, tipoRequisitor: TipoUsuario) {
        const noticia = await this.prismaService.noticia.findUnique({
            where: { id: noticiaId },
            include: { usuario: true }
        });

        if (!noticia) {
            throw new NotFoundException("Notícia não encontrada!");
        }

        const dono = noticia.usuario;

        if (dono.id === requisitorId) return true;

        switch (tipoRequisitor) {
            case TipoUsuario.COMUM:
                throw new ForbiddenException("Ação não autorizada!");

            case TipoUsuario.ADMIN:
                if (dono.tipo === TipoUsuario.ADMINMASTER)
                    throw new ForbiddenException("Ação não autorizada!");

                if (dono.tipo === TipoUsuario.ADMIN && dono.id !== requisitorId)
                    throw new ForbiddenException("Ação não autorizada!");

                return true;

            case TipoUsuario.ADMINMASTER:
                return true;

            default:
                throw new ForbiddenException("Ação não autorizada!");
        }
    }
}