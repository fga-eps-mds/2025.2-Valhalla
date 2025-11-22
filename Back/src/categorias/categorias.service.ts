import  { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { criarCategoriasDto } from './dto/create_categorias.dto';
import { edicaoCategoriasDto } from './dto/edicao_categorias.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { TipoUsuario } from '@prisma/client';

@Injectable()
export class CategoriasService{

    constructor( private prisma: PrismaService){}

    async criarCategorias (data: criarCategoriasDto, tipo: TipoUsuario){

        if (tipo !== TipoUsuario.ADMINMASTER ){
            throw new ForbiddenException('Usuário não autorizado a criar categorias!');
        }

        const criarCategorias = await this.prisma.categoria.create ({
            data: {
                nome: data.nome,
            }

        });
        return criarCategorias;
    }
    
    async editarCategorias(id: number, data: edicaoCategoriasDto, tipo: TipoUsuario){
        
        if (tipo !== TipoUsuario.ADMINMASTER){
            throw new ForbiddenException('Usuário não autorizado a editar categorias!');
        }

        const existeCategorias = await this.prisma.categoria.findUnique({
            where: { id },
        })
        if (!existeCategorias){
            throw new NotFoundException('Categoria não encontrada!');
        }
        return await this.prisma.categoria.update({
            where: { id },
            data: {
                    nome: data.nome,
             },
        });
    }
    
    async deletarCategorias (id: number, tipo: TipoUsuario){
        
        if (tipo !== TipoUsuario.ADMINMASTER){
            throw new ForbiddenException('Usuário não autorizado a deletar categorias!');
        }

        const existeCategorias = await this.prisma.categoria.findUnique({
            where: { id },
        })
        if (!existeCategorias) {
            throw new NotFoundException('Categoria não encontrada!');
        }
        return await this.prisma.categoria.delete({
            where: { id },
        });
    }

    async encontrarCategorias(id: number) {
        if(!id) {
            throw new NotFoundException('Categoria não encontrada!');
        }
        return this.prisma.categoria.findUnique({
            where: { id },
        });
    }
    
    async listarCategorias() {
        const categorias = await this.prisma.categoria.findMany();
        
        if(!categorias || categorias.length === 0) {
            throw new NotFoundException('Nenhuma categoria encontrada!');
        }

        return categorias;
    }
}