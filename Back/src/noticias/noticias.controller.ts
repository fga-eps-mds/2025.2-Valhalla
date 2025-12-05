import { Body, Controller , Post, Param, ParseIntPipe, Patch, Delete, Get, Request, Query, UseGuards, DefaultValuePipe } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { NoticiasDto } from './dto/noticias.dto';
import { EdicaoNoticiasDto } from './dto/edicao.noticias.dto';
import { IsPublic } from 'src/auth/decorators/isPublic.decorator';

@Controller('noticias')
export class NoticiasController {
    constructor(private readonly noticiasService: NoticiasService) {}
}
