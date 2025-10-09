import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario/usuario.service';


@Module({
  imports: [],
  controllers: [],
  providers: [UsuarioService],
})
export class AppModule {}
