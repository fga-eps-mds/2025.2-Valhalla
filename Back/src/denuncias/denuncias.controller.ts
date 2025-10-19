import { Body, Controller, Post, UseGuards, Req, Param, Put, ParseIntPipe, Patch } from '@nestjs/common';
import { DenunciaDto } from './dto/denuncia.dto';
import { edicaoDenunciaDto } from './dto/edicao.denuncia.dto';
import { DenunciasService } from './denuncias.service';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: { id: number; email: string; };
}

@Controller('denuncias')
export class DenunciasController {
    constructor(private readonly denunciasService: DenunciasService) {}

    @Post()
    async create(@Body() data: DenunciaDto) {
        return this.denunciasService.criarDenuncia(data);
    }

    @Patch(':id')
    async editarDenuncia(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: edicaoDenunciaDto,
    ) {
        return this.denunciasService.editarDenuncia(id, data);
    }
}