// noticias.module.ts

import { Module } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { NoticiasController } from './noticias.controller';
import { PrismaModule } from '../database/prisma.module'; 

@Module({
  imports: [PrismaModule],
  controllers: [NoticiasController],
  providers: [NoticiasService],
})
export class NoticiasModule {}