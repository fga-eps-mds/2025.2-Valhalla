
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

@Module({
  imports: [
    DenunciasModule,
    PrismaModule,
    CategoriasModule,
    UsuarioModule,    
    AuthModule        
  ],
  controllers: [
    DenunciasController,
    AppController,
    CategoriasController, 
    UsuarioController,
    AuthController    
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
    },
  ],
})
export class AppModule {}