
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
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { NoticiasController } from './noticias/noticias.controller';
import { NoticiasService } from './noticias/noticias.service';
import { NoticiasModule } from './noticias/noticias.module';
import { ReportDenunciasModule } from './reportDenuncias/reportDenuncias.module';
import { ApoioDenunciaModule } from './apoio-denuncia/apoio-denuncia.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CloudinaryModule,
    DenunciasModule,
    PrismaModule,
    CategoriasModule,
    UsuarioModule,    
    AuthModule,
    ReportDenunciasModule,
    NoticiasModule,
    ApoioDenunciaModule        

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
    {                  
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }, NoticiasService,
  ],
})
export class AppModule {}