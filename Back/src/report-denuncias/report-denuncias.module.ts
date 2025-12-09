import { Module } from '@nestjs/common';
import { ReportDenunciasService } from './report-denuncias.service';
import { ReportDenunciasController } from './report-denuncias.controller';

@Module({
  providers: [ReportDenunciasService],
  controllers: [ReportDenunciasController]
})
export class ReportDenunciasModule {}
