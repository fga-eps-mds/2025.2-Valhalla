import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { reportDenunciasDto } from './dto/report-denuncias.dto';

@Injectable()
export class ReportDenunciasService {
    constructor (private prisma: PrismaService) {}

    async CriarReportDenuncia (data: reportDenunciasDto) {
        const reportDenuncia = await this.prisma.reportsDenuncia.create({data});
    }
}
