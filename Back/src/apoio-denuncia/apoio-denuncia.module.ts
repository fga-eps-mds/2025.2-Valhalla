import { Module } from '@nestjs/common';
import { ApoioDenunciaService } from './apoio-denuncia.service';
import { ApoioDenunciaController } from './apoio-denuncia.controller';

@Module({
  controllers: [ApoioDenunciaController],
  providers: [ApoioDenunciaService],
})
export class ApoioDenunciaModule {}
