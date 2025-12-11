import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { reportDenunciasDto } from './dto/reportDenuncias.dto';

@Injectable()
export class ReportDenunciasService {
    constructor (private prisma: PrismaService) {}

    async CriarReportDenuncia (data: reportDenunciasDto) {
        // Verifica se o usuário já reportou esta denúncia
        const reportExistente = await this.prisma.reportsDenuncia.findUnique({
            where: {
                idUsuario_idDenuncia: { idUsuario: data.idUsuario, idDenuncia: data.idDenuncia },
            },
        });

        if (reportExistente) {
            throw new BadRequestException('Você já reportou esta denúncia.');
        }

        try {
            const reportDenuncia = await this.prisma.reportsDenuncia.create({ data });
            return { status: 'criado', mensagem: 'Report registrado.', id: reportDenuncia.id };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException('Você já reportou esta denúncia.');
            }
            throw error;
        }
    }

    async acharTodosReports(){
        return await this.prisma.reportsDenuncia.findMany();
    }

    async verificarSeUsuarioReportou(idUsuario: number, idDenuncia: number) {
        const report = await this.prisma.reportsDenuncia.findUnique({
            where: {
                idUsuario_idDenuncia: { idUsuario, idDenuncia },
            },
        });
        return { reportado: !!report };
    }

    async deletarReport(id:number){
        const report = await this.prisma.reportsDenuncia.findUnique({
            where:{
                id,
            }
        });

        if(!report){
            throw new Error('report não encontrado')
        }

        return await this.prisma.reportsDenuncia.delete({
            where: {
                id,
            }
        });
    }
}
