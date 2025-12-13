import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ReportDenunciasService } from './reportDenuncias.service';
import { reportDenunciasDto } from './dto/reportDenuncias.dto';

@Controller('report-denuncias')
export class ReportDenunciasController {
    constructor (private readonly reportDenunciasService: ReportDenunciasService) {}

    @Post()
    async CriarReport(@Body() data: reportDenunciasDto){
        return this.reportDenunciasService.CriarReportDenuncia(data);
    }
    @Get()
    async acharTodos(){
        return this.reportDenunciasService.acharTodosReports();
    }
    @Get('status/:idDenuncia/:idUsuario')
    async verificarStatus(
      @Param('idDenuncia', ParseIntPipe) idDenuncia: number,
      @Param('idUsuario', ParseIntPipe) idUsuario: number,
    ) {
      return this.reportDenunciasService.verificarSeUsuarioReportou(idUsuario, idDenuncia);
    }
    @Delete(':id')
    async deletar(@Param('id', ParseIntPipe) id: number) {
        return this.reportDenunciasService.deletarReport(Number(id));
    }
}
