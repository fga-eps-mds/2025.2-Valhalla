import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { PrismaService } from 'src/database/prisma.service';
import { AdminMasterGuard } from 'src/autenticacao/admin-master.guard';

@Module({
  providers: [UsuarioService, PrismaService, AdminMasterGuard],
  controllers: [UsuarioController]
})
export class UsuarioModule {}
