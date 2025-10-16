import { Module } from '@nestjs/common';
//import { UsuarioService } from './usuario/usuario.service';
import { DenunciaService } from './denuncia/denuncia.service';
import { DenunciaController } from './denuncia/denuncia.controller';
import { DenunciaModule } from './denuncia/denuncia.module';
import { DenunciasModule } from './denuncias/denuncias.module';


@Module({
  imports: [DenunciaModule, DenunciasModule],
  controllers: [DenunciaController],
  providers: [DenunciaService],
})
export class AppModule {}
