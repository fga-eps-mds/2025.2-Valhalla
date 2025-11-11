import { Body, Controller, Post, UseGuards, Req, Param, Put, ParseIntPipe, Patch, Delete, Get } from '@nestjs/common';
import { DenunciaDto } from './dto/denuncia.dto';
import { edicaoDenunciaDto } from './dto/edicao.denuncia.dto';
import { DenunciasService } from './denuncias.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('denuncias')
export class DenunciasController {
    constructor(private readonly denunciasService: DenunciasService) {}

    @Post()
    async criarDenuncia(@Body() data: DenunciaDto) {
        return this.denunciasService.criarDenuncia(data);
    }

    @Patch(':id')
    async editarDenuncia(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: edicaoDenunciaDto,
    ) {
        return this.denunciasService.editarDenuncia(id, data);
    }

    @Delete(':id')
    async deletarDenuncia(
      @Param('id', ParseIntPipe) id: number,
    ) {
        return this.denunciasService.deletarDenuncia(id);
    }

    @Patch('soft-delete/:id')
    async desativarDenuncia(
      @Param('id', ParseIntPipe) id: number
    ) {
        return this.denunciasService.desativarDenuncia(id);
    }
    @IsPublic()
    @Get(':id')
    async encontrarDenuncia(
      @Param('id', ParseIntPipe) id: number,
    ) {
        return this.denunciasService.encontrarDenuncia(id);
    }
    @IsPublic()
    @Get()
    async listarDenuncias() {
        return this.denunciasService.listarDenuncias();
    }

}