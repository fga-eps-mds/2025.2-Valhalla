import { Module } from '@nestjs/common';
import { ReportDenunciasService } from './reportDenuncias.service';
import { ReportDenunciasController } from './reportDenuncias.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ReportDenunciasService],
  controllers: [ReportDenunciasController]
})
export class ReportDenunciasModule {}
