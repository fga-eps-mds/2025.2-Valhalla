import { Body, Controller , Post, Param, ParseIntPipe, Patch, Delete, Get, Request, Query, UseGuards } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { NoticiasDto } from './dto/noticias.dto';
import { EdicaoNoticiasDto } from './dto/edicao.noticias.dto';


@Controller('noticias')
export class NoticiasController {
    
}
