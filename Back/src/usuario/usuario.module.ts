import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [UsuarioService,PrismaService],
  controllers: [UsuarioController]
})
export class UsuarioModule {}
