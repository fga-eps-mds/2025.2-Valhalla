import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { reportDenunciasDto } from './dto/report-denuncias.dto';

@Injectable()
export class ReportDenunciasService {
    constructor (private prisma: PrismaService) {}

    async CriarReportDenuncia (data: reportDenunciasDto) {
        const reportDenuncia = await this.prisma.reportsDenuncia.create({data});
    }

    async acharTodosReports(){
        return await this.prisma.reportsDenuncia.findMany();
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
