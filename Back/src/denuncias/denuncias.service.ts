import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { DenunciaDto } from './dto/denuncia.dto';

@Injectable()
export class DenunciasService{

    constructor (private prisma: PrismaService){}

    async criarDenuncia (data: DenunciaDto){
        const criacaoDenuncia = await this.prisma.denuncia.create({
            data: {
                idUsuario: data.idUsuario,
                descricao: data.descricao,
                idCategoria: data.idCategoria,
                mediasrc: data.mediasrc,
                anonimato: data.anonimato,
            }});
        return criacaoDenuncia;
    }
}