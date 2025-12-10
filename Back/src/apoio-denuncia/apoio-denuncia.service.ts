import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service'; // Verifique se o caminho volta corretamente para database
import { AlternarApoioDto } from './dto/alternar-apoio.dto';

@Injectable()
export class ApoioDenunciaService {
  constructor(private readonly prisma: PrismaService) {}

  // Apoiar ou Remover apoio
  async alternarApoio(dto: AlternarApoioDto) {
    const { idUsuario, idDenuncia } = dto;

    // Verifica denúncia
    const denunciaExiste = await this.prisma.denuncia.findUnique({
      where: { id: idDenuncia },
    });
    
    if (!denunciaExiste) throw new NotFoundException('Denúncia não encontrada.');

    // Verifica se já apoiou 
    const apoioExistente = await this.prisma.apoiosDenuncia.findUnique({
      where: {
        idUsuario_idDenuncia: { idUsuario, idDenuncia },
      },
    });

    if (apoioExistente) {
      // Remove 
      await this.prisma.apoiosDenuncia.delete({ where: { id: apoioExistente.id } });
      return { status: 'removido', mensagem: 'Apoio removido.' };
    } else {
      // Cria 
      await this.prisma.apoiosDenuncia.create({ data: { idUsuario, idDenuncia } });
      return { status: 'adicionado', mensagem: 'Apoio registrado.' };
    }
  }

  // Contar Apoios
  async contarApoios(idDenuncia: number) {
    const total = await this.prisma.apoiosDenuncia.count({
      where: { idDenuncia },
    });
    return { idDenuncia, total };
  }

  // Verificar Status 
  async verificarSeUsuarioApoiou(idUsuario: number, idDenuncia: number) {
    const apoio = await this.prisma.apoiosDenuncia.findUnique({
      where: {
        idUsuario_idDenuncia: { idUsuario, idDenuncia },
      },
    });
    return { apoiado: !!apoio };
  }
}