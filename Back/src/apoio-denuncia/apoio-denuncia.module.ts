import { Module } from '@nestjs/common';
import { ApoioDenunciaService } from './apoio-denuncia.service';
import { ApoioDenunciaController } from './apoio-denuncia.controller';
import { PrismaService } from '../database/prisma.service'; 

@Module({
  controllers: [ApoioDenunciaController],
  providers: [ApoioDenunciaService, PrismaService],
})
export class ApoioDenunciaModule {}