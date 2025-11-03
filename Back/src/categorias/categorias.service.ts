import  { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { criarCategoriasDto } from './dto/create_categorias.dto';
import { edicaoCategoriasDto } from './dto/edicao_categorias.dto';
import { dot } from 'node:test/reporters';

@Injectable()
export class CategoriasService{

    constructor( private prisma: PrismaService){}

    async criarCategorias (data: criarCategoriasDto){
        const criarCategorias = await this.prisma.categoria.create ({
            data: {
                id: data.id,
                nome: data.nome,
            }

        });
        return criarCategorias;
    }
    
    async editarCategorias(id: number, data: edicaoCategoriasDto){
        const existeCategorias = await this.prisma.categoria.findUnique({
            where: { id },
        })
        if (!existeCategorias){
            throw new Error('Categoria não encontrada!');
        }
        return await this.prisma.categoria.update({
            where: { id },
            data: {
                    nome: data.nome,
             },
        });
    }
    
    async deletarCategorias (id: number){
        const existeCategorias = await this.prisma.categoria.findUnique({
            where: { id },
        })
        if (!existeCategorias) {
            throw new Error('Denúncia não encontrada!');
        }
        return await this.prisma.categoria.delete({
            where: { id },
        });
    }

    async encontrarCategorias(id: number) {
        if(!id) {
            throw new Error('Categoria não encontrada!');
        }
        return this.prisma.categoria.findUnique({
            where: { id },
        });
    }
    
    async listarCategorias() {
        return this.prisma.categoria.findMany();
    }
}