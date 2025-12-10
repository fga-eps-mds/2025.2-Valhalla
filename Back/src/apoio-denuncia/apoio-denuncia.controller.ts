import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApoioDenunciaService } from './apoio-denuncia.service';
import { AlternarApoioDto } from './dto/alternar-apoio.dto';

@Controller('apoio-denuncia')
export class ApoioDenunciaController {
  constructor(private readonly apoioService: ApoioDenunciaService) {}

  @Post('alternar')
  async alternar(@Body() dto: AlternarApoioDto) {
    return this.apoioService.alternarApoio(dto);
  }

  @Get('contagem/:idDenuncia')
  async contar(@Param('idDenuncia', ParseIntPipe) idDenuncia: number) {
    return this.apoioService.contarApoios(idDenuncia);
  }

  @Get('status/:idDenuncia/:idUsuario')
  async verificarStatus(
    @Param('idDenuncia', ParseIntPipe) idDenuncia: number,
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
  ) {
    return this.apoioService.verificarSeUsuarioApoiou(idUsuario, idDenuncia);
  }
}