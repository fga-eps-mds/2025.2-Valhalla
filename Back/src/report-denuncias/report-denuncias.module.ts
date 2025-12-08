import { Module } from '@nestjs/common';
import { ReportDenunciasService } from './report-denuncias.service';

@Module({
  providers: [ReportDenunciasService]
})
export class ReportDenunciasModule {}
