import { Body, Controller, Post, UseGuards, Req, Param, Put, ParseIntPipe, Patch, Delete, Get} from '@nestjs/common';
import { IsPublic } from '../auth/decorators/isPublic.decorator';
import { criarCategoriasDto } from './dto/create_categorias.dto';
import { edicaoCategoriasDto } from './dto/edicao_categorias.dto';
import { CategoriasService } from './categorias.service';

@Controller('categoria')
export class CategoriasController {
    constructor(private readonly categoriasService: CategoriasService) {}

    @Post()
    async criarCategorias (@Body() data: criarCategoriasDto ) {
        return this.categoriasService.criarCategorias(data);
    }
    
    @Patch('id')
    async editarCategoria(
        @Param ('id', ParseIntPipe) id: number,
        @Body() data: edicaoCategoriasDto,
    ) {
        return this.categoriasService.editarCategorias(id, data);
    }

    @Delete(':id')
    async deletarCategoria(
        @Param('id', ParseIntPipe) id: number,   
    ){
        return this.categoriasService.deletarCategorias(id);
    }

    @Get(':id')
    async encontrarCategorias(
      @Param('id', ParseIntPipe) id: number,
    ) {
        return this.categoriasService.encontrarCategorias(id);
    }

    @IsPublic()
    @Get()
    async listarCategorias() {
        return this.categoriasService.listarCategorias();
    }
}
