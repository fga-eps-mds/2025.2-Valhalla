import { Module } from '@nestjs/common';
import { DenunciaService } from './denuncia/denuncia.service';
import { DenunciaController } from './denuncia/denuncia.controller';
import { DenunciaModule } from './denuncia/denuncia.module';
import { UsuarioService } from './usuario/usuario.service';
import { UsuarioModule } from './usuario/usuario.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [DenunciaModule,UsuarioModule],
  controllers: [DenunciaController,AppController],
  providers: [DenunciaService,AppService],
})
export class AppModule {}
