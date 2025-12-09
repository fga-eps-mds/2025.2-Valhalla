
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DenunciasModule } from './denuncias/denuncias.module'; 
import { PrismaModule } from './database/prisma.module'; 

import { CategoriasController } from './categorias/categorias.controller';
import { CategoriasService } from './categorias/categorias.service';
import { CategoriasModule } from './categorias/categorias.module';

import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.auth.guard';
import { UsuarioModule } from './usuario/usuario.module'; 
import { UsuarioController } from './usuario/usuario.controller';
import { UsuarioService } from './usuario/usuario.service';
import { DenunciasController } from './denuncias/denuncias.controller';
import { DenunciasService } from './denuncias/denuncias.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { NoticiasController } from './noticias/noticias.controller';
import { NoticiasService } from './noticias/noticias.service';
import { NoticiasModule } from './noticias/noticias.module';

@Module({
  imports: [
    DenunciasModule,
    PrismaModule,
    CategoriasModule,
    UsuarioModule,    
    AuthModule,
    ReportDenunciasModule,
    NoticiasModule        

  ],
  controllers: [
    DenunciasController,
    AppController,
    CategoriasController, 
    UsuarioController,
    AuthController,
    NoticiasController    
  ],
  providers: [
    DenunciasService,
    AppService,
    CategoriasService, 
    UsuarioService,    
    //AuthService,    
    {                  
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }, NoticiasService,
  ],
})
export class AppModule {}