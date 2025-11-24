import { Body, Controller, Post, UseGuards, Param, ParseIntPipe, Patch, Delete, Get, Request} from '@nestjs/common';
import { IsPublic } from '../auth/decorators/isPublic.decorator';
import { criarCategoriasDto } from './dto/create_categorias.dto';
import { edicaoCategoriasDto } from './dto/edicao_categorias.dto';
import { CategoriasService } from './categorias.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { AuthRequest } from 'src/auth/models/authRequest';

@Controller('categorias')
export class CategoriasController {
    constructor(private readonly categoriasService: CategoriasService) {}

    @Post()
    async criarCategorias (
        @Body() data: criarCategoriasDto,
        @Request() req: AuthRequest,
    ) {
        return this.categoriasService.criarCategorias(data, req.user.tipo);
    }
    
    @Patch(':id')
    async editarCategoria(
        @Param ('id', ParseIntPipe) id: number,
        @Body() data: edicaoCategoriasDto,
        @Request() req: AuthRequest,
    ) {
        return this.categoriasService.editarCategorias(id, data, req.user.tipo);
    }

    @Delete(':id')
    async deletarCategoria(
        @Param('id', ParseIntPipe) id: number,   
        @Request() req: AuthRequest,
    ){
        return this.categoriasService.deletarCategorias(id, req.user.tipo);
    }

    @IsPublic()
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
