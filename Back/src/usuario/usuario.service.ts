import { Injectable } from '@nestjs/common';
import { UsuarioDto } from './dto/usuario.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UsuarioService {

constructor(private prisma: PrismaService) {}

    async CriarUsuario(DadosUsuario: UsuarioDto){
        const CriacaoDeUsuario = await this.prisma.usuario.create({
            data:{
                nome: DadosUsuario.nome,
                email: DadosUsuario.email,
                senha: DadosUsuario.senha,
                cargo: DadosUsuario.cargo,
                mediasrc: DadosUsuario.mediasrc,
                role: false,
                admMaster:false
            }     
     
        })

         return CriacaoDeUsuario;
        
    }

    async DeletarUsuario(id: number){
        const UsuarioExiste = await this.prisma.usuario.findUnique({
            where: {
                id,
            }
        });

        if (!UsuarioExiste) {
            throw new Error("Usuário Não Encontrado!")
        }
        
        return await this.prisma.usuario.delete({
            where: {
                id,
            }
        })
    }

}
