import { Module } from '@nestjs/common';
//import { UsuarioService } from './usuario/usuario.service';
import { DenunciaService } from './denuncia/denuncia.service';
import { DenunciaController } from './denuncia/denuncia.controller';
import { DenunciaModule } from './denuncia/denuncia.module';


@Module({
  imports: [DenunciaModule],
  controllers: [DenunciaController],
  providers: [DenunciaService],
})
export class AppModule {}
