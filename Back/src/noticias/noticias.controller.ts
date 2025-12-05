import { Body, Controller , Post, Param, ParseIntPipe, Patch, Delete, Get, Request, Query, UseGuards, DefaultValuePipe } from '@nestjs/common';
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
        return this.noticiasService.criarNoticia(req.user.id, data);
    }

    @Patch(':id')
    async editarNoticia(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthRequest,
        @Body() data: EdicaoNoticiasDto,
    ) {
        return this.noticiasService.editarNoticia(id, req.user.id, data);
    }

}
