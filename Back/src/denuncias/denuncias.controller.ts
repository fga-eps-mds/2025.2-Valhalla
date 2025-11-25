import { Body, Controller, Post, Param, ParseIntPipe, Patch, Delete, Get, UseGuards, Request } from '@nestjs/common';
import { DenunciaDto } from './dto/denuncia.dto';
import { edicaoDenunciaDto } from './dto/edicao.denuncia.dto';
import { DenunciasService } from './denuncias.service';
import { IsPublic } from 'src/auth/decorators/isPublic.decorator';
import { AuthRequest } from 'src/auth/models/authRequest';

@Controller('denuncias')
export class DenunciasController {
    constructor(private readonly denunciasService: DenunciasService) {}

    
    @Post()
    async criarDenuncia(
      @Request() req: AuthRequest,
      @Body() data: DenunciaDto
    ) {
        return this.denunciasService.criarDenuncia(req.user.id, data);
    }

    @Patch(':id')
    async editarDenuncia(
      @Param('id', ParseIntPipe) id: number,
      @Request() req: AuthRequest,
      @Body() data: edicaoDenunciaDto,
    ) {
        return this.denunciasService.editarDenuncia(id, req.user.id, data);
    }

    @Delete('delete-permanente/:id')
    async deletarDenuncia(
      @Param('id', ParseIntPipe) id: number,
      @Request() req: AuthRequest,
    ) {
        return this.denunciasService.deletarDenuncia(id, req.user.id, req.user.tipo);
    }

    @Delete(':id')
    async desativarDenuncia(
      @Param('id', ParseIntPipe) id: number,
      @Request() req: AuthRequest,
    ) {
        return this.denunciasService.desativarDenuncia(id, req.user.id, req.user.tipo);
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