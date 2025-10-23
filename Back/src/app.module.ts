import { Module } from '@nestjs/common';
import { DenunciasService } from './denuncias/denuncias.service';
import { DenunciasController } from './denuncias/denuncias.controller';
import { DenunciasModule } from './denuncias/denuncias.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PrismaModule } from './database/prisma.module';
import { CategoriasController } from './categorias/categorias.controller';
import { CategoriasService } from './categorias/categorias.service';
import { CategoriasModule } from './categorias/categorias.module';
@Module({
  imports: [DenunciasModule, PrismaModule, CategoriasModule],
  controllers: [DenunciasController,AppController, CategoriasController],
  providers: [DenunciasService,AppService, CategoriasService],
})
export class AppModule {}
