import { Body, Controller , Post, Param, ParseIntPipe, Patch, Delete, Get, Request, Query, DefaultValuePipe } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { NoticiasDto } from './dto/noticias.dto';
import { EdicaoNoticiasDto } from './dto/edicao.noticias.dto';
import { IsPublic } from 'src/auth/decorators/isPublic.decorator';
import { AuthRequest } from 'src/auth/models/authRequest';

@Controller('noticias')
export class NoticiasController {
    constructor(private readonly noticiasService: NoticiasService) {}

    @Post()
    async criarNoticia(
        @Request() req: AuthRequest,
        @Body() data: NoticiasDto,
    ) {
        return this.noticiasService.criarNoticia(req.user?.id, data, req.user?.tipo);
    }

    @Patch(':id')
    async editarNoticia(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthRequest,
        @Body() data: EdicaoNoticiasDto,
    ) {
        return this.noticiasService.editarNoticia(id, req.user?.id, data, req.user?.tipo);
    }

    @Delete('delete-permanente/:id')
    async deletarNoticia(
      @Param('id', ParseIntPipe) id: number,
      @Request() req: AuthRequest,
    ) {
        return this.noticiasService.deletarNoticia(id, req.user?.id, req.user?.tipo);
    }

    @Delete(':id')
    async desativarNoticia(
      @Param('id', ParseIntPipe) id: number,
      @Request() req: AuthRequest,
    ) {
        return this.noticiasService.desativarNoticia(id, req.user?.id, req.user?.tipo);
    }

    @IsPublic()
    @Get(':id')
    async encontrarNoticia(
      @Param('id', ParseIntPipe) id: number,
    ) {
        return this.noticiasService.encontrarNoticia(id);
    }

    @IsPublic()
    @Get()
    async listarNoticias(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
    ) {
      return this.noticiasService.listarNoticias(page, limit);
    }

    
    @IsPublic()
    @Get('usuario/:id')
    async listarNoticiasPorUsuario(
      @Param('id', ParseIntPipe) id: number,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
    ) {
      return this.noticiasService.listarNoticiasPorUsuario(id, page, limit);
    }
}
