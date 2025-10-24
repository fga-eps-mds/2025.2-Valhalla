import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario/usuario.service';
import { UsuarioModule } from './usuario/usuario.module';
import { UsuarioController } from './usuario/usuario.controller';
import { DenunciasService } from './denuncias/denuncias.service';
import { DenunciasController } from './denuncias/denuncias.controller';
import { DenunciasModule } from './denuncias/denuncias.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DenunciasModule, PrismaModule, UsuarioModule, AuthModule],
  controllers: [DenunciasController,AppController, UsuarioController],
  providers: [DenunciasService,AppService, UsuarioService],
})
export class AppModule {}
