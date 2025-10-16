import { Module } from '@nestjs/common';
import { DenunciasController } from './denuncias.controller';
import { DenunciasService } from './denuncias.service'
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [DenunciasService, PrismaService],
  controllers: [DenunciasController]
})
export class DenunciasModule {}
