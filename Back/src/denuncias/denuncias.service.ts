import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { DenunciaDto } from './dto/denuncia.dto';

@Injectable()
export class DenunciasService{

    constructor (private prisma: PrismaService){}

    async create (data: DenunciaDto, idUsuario: number){
        const denuncia = await this.prisma.denuncia.create({
            data: {
                ...data,
                idUsuario: idUsuario
            }
        });

        return denuncia;
    }

}
