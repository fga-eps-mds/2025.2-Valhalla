import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { CategoriasService } from './categorias.service';

@Module({
    imports: [PrismaModule],
    controllers: [CategoriasController],
    providers: [CategoriasService]
})
export class CategoriasModule {}