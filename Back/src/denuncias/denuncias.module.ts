import { Module } from '@nestjs/common';
import { DenunciasController } from './denuncias.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { DenunciasService } from './denuncias.service';

@Module({
  imports: [PrismaModule],
  providers: [DenunciasService],
  controllers: [DenunciasController]
})
export class DenunciasModule {}
