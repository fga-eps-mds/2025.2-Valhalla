import { Module } from '@nestjs/common';
import { DenunciasController } from './denuncias.controller';

@Module({
  controllers: [DenunciasController]
})
export class DenunciasModule {}
