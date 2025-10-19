import { Body, Controller, Post, UseGuards, Req, Param } from '@nestjs/common';
import { DenunciaDto } from './dto/denuncia.dto';
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
}