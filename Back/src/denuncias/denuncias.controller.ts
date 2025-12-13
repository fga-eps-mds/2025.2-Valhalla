import { Body, Controller, Post, Param, ParseIntPipe, Patch, Delete, Get, UseGuards, Request } from '@nestjs/common';
import { DenunciaDto } from './dto/denuncia.dto';
import { edicaoDenunciaDto } from './dto/edicao.denuncia.dto';
import { DenunciasService } from './denuncias.service';
import { IsPublic } from 'src/auth/decorators/isPublic.decorator';
import { AuthRequest } from 'src/auth/models/authRequest';
import { DefaultValuePipe } from '@nestjs/common/pipes/default-value.pipe';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';

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
    async listarDenuncias(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
      @Query('usuario') usuario?: number,
    ) {
      return this.denunciasService.listarDenuncias(page, limit, usuario);
    }

    @IsPublic()
    @Get('usuario/:id')
    async listarDenunciasPorUsuario(
      @Param('id', ParseIntPipe) id: number,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
    ) {
      return this.denunciasService.listarDenunciasPorUsuario(id, page, limit);
    }
  
    @Get('usuario/apoiadas/:id')
    async listarDenunciasApoiadasPeloUsuario(
      @Param('id', ParseIntPipe) id: number,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
    ) {
      return this.denunciasService.listarDenunciasApoiadasPeloUsuario(id, page, limit);
    }

    @Get('denuncias/reportadas')
    async listarDenunciasReportadas(
      @Request() req: AuthRequest,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
    ) {
      return this.denunciasService.listarDenunciasReportadas(req.user.id, page, limit);
    }

    @Get('denuncias/top-denuncias')
    async topDenuncias() {
      return this.denunciasService.topDenuncias();
    }
    
}