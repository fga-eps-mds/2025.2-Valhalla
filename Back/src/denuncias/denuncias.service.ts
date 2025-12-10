import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { DenunciaDto } from './dto/denuncia.dto';
import { edicaoDenunciaDto } from './dto/edicao.denuncia.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';

@Injectable()
export class DenunciasService{

    constructor (private prisma: PrismaService){}

    async criarDenuncia (idUsuario: number, data: DenunciaDto){

        const categoria = await this.prisma.categoria.findUnique({
            where: { id: data.idCategoria },
        });

        if (!categoria) {
            throw new NotFoundException('Categoria não encontrada!');
        }

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
            throw new NotFoundException('Denúncia não encontrada!');
        }
        
        if (existeDenuncia.idUsuario !== idUsuario) {
            throw new ForbiddenException('Usuário não autorizado a editar esta denúncia!');
        }
        if (existeDenuncia.dataDelete) {
            throw new ForbiddenException('Não é possível editar uma denúncia desativada!');
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

    async deletarDenuncia (id: number, idUsuario: number, idTipo: TipoUsuario){
        await this.definirHierarquia(id, idUsuario, idTipo);
        
        return await this.prisma.denuncia.delete({
            where: { id },
        });
    }

    async desativarDenuncia (id: number, idUsuario: number, idTipo: TipoUsuario){
        await this.definirHierarquia(id, idUsuario, idTipo);

        if (await this.prisma.denuncia.findUnique({where: {id, dataDelete: {not: null}}})){
            throw new NotFoundException("Denuncia não encontrada!");
        }

        return await this.prisma.denuncia.update({
            where: { id },
            data: {
                dataDelete: new Date(),
            },
        });
    }

    async encontrarDenuncia(id: number) {
        const denuncia = await this.prisma.denuncia.findUnique({
            where: { id },
        });
        
        if (!denuncia || denuncia.dataDelete) {
            throw new NotFoundException('Denuncia não Encontrada!');
        }
        return denuncia;
    }

    async listarDenuncias(page: number, limit: number, Usuario?: number) {

        const skip = (page - 1) * limit;

        const denuncias = await this.prisma.denuncia.findMany({
            where: {dataDelete: null, usuario: {dataDelete: null}, ...(Usuario ? {idUsuario: { not: Usuario }} : {})}, 
            orderBy: {id: 'desc'},
            skip: skip,
            take: limit,
            select: {
                id: true,
                descricao: true,
                idCategoria: true,
                mediaSrc: true,
                anonimato: true,
                dataCriacao: true,
                dataUpdate: true,
                idUsuario: true,
                usuario: {
                    select: {
                        nome: true,
                        mediaSrc: true,
                    }
                },
                categoria: {
                    select: {
                        nome: true,
                    }
                }
            }
        });

        const totalDenuncias = await this.prisma.denuncia.count({
            where: {dataDelete: null, usuario: {dataDelete: null}, ...(Usuario ? {idUsuario: { not: Usuario }} : {})},
        });

        return { denuncias, totalDenuncias };
    }

    async listarDenunciasPorUsuario(idUsuario: number, page: number, limit: number) {

        const skip = (page - 1) * limit;

        const denuncias = await this.prisma.denuncia.findMany({
            where: {dataDelete: null, idUsuario: idUsuario},
            orderBy: {id: 'desc'},
            skip: skip,
            take: limit,
            select: {
                id: true,
                descricao: true,
                idCategoria: true,
                mediaSrc: true,
                anonimato: true,
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
                categoria: {
                    select: {
                        nome: true,
                    }
                }
            }
        });

        const totalDenuncias = await this.prisma.denuncia.count({
            where: {dataDelete: null, idUsuario: idUsuario},
        });

        return { denuncias, totalDenuncias };
    }

    private async definirHierarquia(idDenuncia: number, idRequisitor: number, idTipo: TipoUsuario){
        
        const denuncia = await this.prisma.denuncia.findUnique({
            where: {
                id: idDenuncia,
            }
        });

        if (!denuncia) {
            throw new NotFoundException("Denuncia Não Encontrado!")
        }

        const usuarioDenuncia = await this.prisma.usuario.findUnique({
            where: {
                id: denuncia.idUsuario,
            }
        });

        if (!usuarioDenuncia) {
            throw new NotFoundException("Usuário Não Encontrado!")
        }

        if (idRequisitor === denuncia.idUsuario) {
            return true;
        }

        switch (idTipo){
            case TipoUsuario.COMUM :
                throw new ForbiddenException("Ação não autorizada!");

            case TipoUsuario.ADMIN :
                if (usuarioDenuncia.tipo === TipoUsuario.ADMINMASTER){
                    throw new ForbiddenException("Ação não autorizada!");
                }
                if (usuarioDenuncia.tipo === TipoUsuario.ADMIN && usuarioDenuncia.id !== idRequisitor){
                    throw new ForbiddenException("A ção não autorizada!");
                }
                if (usuarioDenuncia.tipo === TipoUsuario.COMUM){
                    return true;
                }
                break;

            case TipoUsuario.ADMINMASTER :
                return true;

            default:
                throw new ForbiddenException("Ação não autorizada!");
        }

        throw new ForbiddenException("Ação não autorizada!");
    }

}