import { Module } from '@nestjs/common';
import { DenunciasService } from './denuncias/denuncias.service';
import { DenunciasController } from './denuncias/denuncias.controller';
import { DenunciasModule } from './denuncias/denuncias.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [DenunciasModule, DenunciasModule, PrismaModule],
  controllers: [DenunciasController,AppController],
  providers: [DenunciasService,AppService],
})
export class AppModule {}
