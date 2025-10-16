import { Module } from '@nestjs/common';
import { DenunciasService } from './denuncias/denuncias.service';
import { DenunciasController } from './denuncias/denuncias.controller';
import { DenunciasModule } from './denuncias/denuncias.module';


@Module({
  imports: [DenunciasModule, DenunciasModule],
  controllers: [DenunciasController],
  providers: [DenunciasService],
})
export class AppModule {}
