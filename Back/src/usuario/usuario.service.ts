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
// Filtro de usuários por email (função para adm)
    async BuscarUsuarioPorEmail(email: string){
        const usuario = await this.prisma.usuario.findUnique({
            where: {
                email: email,
            }
        });

        if (!usuario) {
            throw new Error("Usuário com este email não foi encontrado!");
        }

        return usuario;
    }

// Filtro de denúncias para o usuário.
// Recomendado que o filtro vá para o crud de denúncias.
        async FiltrarDenunciasPorTipo(tipo: string) {

        const denuncias = await this.prisma.denuncia.findMany({
            where: {

                tipo: {
                    contains: tipo, 
                    mode: 'insensitive' 
                }
            },
            // Inclui alguns dados do autor da denúncia para dar mais contexto
            include: {
                autor: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        });

        // Retorna a lista de denúncias encontradas (pode ser uma lista vazia)
        return denuncias;
    }
}
