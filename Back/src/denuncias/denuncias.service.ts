import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DenunciasService{

    constructor (private prisma: PrismaService){}


}
