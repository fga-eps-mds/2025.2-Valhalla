import { Injectable } from '@nestjs/common';
import { NoticiasDto } from './dto/noticias.dto';
import { EdicaoNoticiasDto } from './dto/edicao.noticias.dto';


@Injectable()
export class NoticiasService {
      async criarNoticia(idUsuario: number, data: NoticiasDto) {
  }

    async editarNoticia(id: number, idUsuario: number, data: EdicaoNoticiasDto) {}

    async deletarDenuncia(id: number, idUsuario: number, tipoUsuario: string) {}

    async desativarDenuncia(id: number, idUsuario: number, tipoUsuario: string) {}

    async encontrarDenuncia(id: number) {}

    async listarDenuncias(page: number, limit: number) {}

    async listarDenunciasPorUsuario(idUsuario: number, page: number, limit: number) {}

}
