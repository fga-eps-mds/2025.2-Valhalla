import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { UsuarioPayload } from './models/usuarioPayload';
import { UsuarioToken } from './models/usuarioToken';
import { EdicaoUsuarioDto } from 'src/usuario/dto/edicao.usuario.dto';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { TipoUsuario, Usuario } from '@prisma/client';


@Injectable()

export class AuthService {
    constructor(
      private readonly usuarioService: UsuarioService, 
      private readonly jwtService: JwtService, 
      private readonly mailService: MailService,
      private readonly configService: ConfigService){}


     login(usuario: Usuario, lembrar?: boolean): UsuarioToken {
        const payload: UsuarioPayload = {
            sub: usuario.id!,
            email: usuario.email,
            tipo: usuario.tipo as TipoUsuario,
        };

        const tempoExpiracao = lembrar ? '90d' : '6h';

        const jwtToken = this.jwtService.sign(payload, { expiresIn: tempoExpiracao });

        return {
            access_token: jwtToken,
            user: {
                id: usuario.id!,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo as TipoUsuario,
                mediaSrc: usuario.mediaSrc,
            },
        }
    }
    

    async validateUser(email: string, senha: string): Promise<any> {
        
      const usuario = await this.usuarioService.procurarPorEmail(email);
        
        if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
          const {senha, ...result} = usuario;
          return result;
        };
        return null;
    }


    async mudarSenha(usuarioId, senhaAntiga: string, senhaNova: string){
        const usuario = await this.usuarioService.encontrarUsuarioAuth(usuarioId)
        if (!usuario){
            throw new NotFoundException("usuario não encontrado")
        }

        const verificar = await bcrypt.compare(senhaAntiga, usuario.senha)
            if(!verificar) {
                throw new UnauthorizedException('credenciais erradas');
            }
        
        const novaSenhahash = await bcrypt.hash(senhaNova, 10);
        usuario.senha = novaSenhahash;
            
        const dadosParaAtualizar = new EdicaoUsuarioDto();
        dadosParaAtualizar.senha = novaSenhahash

        await this.usuarioService.editarUsuario(usuario.id, dadosParaAtualizar, {senha: true});
        
    }


    async esqueciSenha(email: string): Promise<{ message: string }> {
      const usuario = await this.usuarioService.procurarPorEmail(email);

      if (!usuario) {
        return { message: 'Se um utilizador com esse email existir, um link de redefinição será enviado.' };
      }

      const payload: UsuarioPayload = { 
        sub: usuario.id!,
        email: usuario.email,
        tipo: usuario.tipo as TipoUsuario,
      };
      
      const resetSecret = this.configService.get<string>('JWT_PASSWORD_RESET_SECRET');
      const expiresIn = '15m';

      const token = this.jwtService.sign(payload, {
        secret: resetSecret,
        expiresIn: expiresIn,
      });

      try {
        await this.mailService.sendPasswordResetEmail(usuario, token);
      } catch (error) {
        console.error('Falha ao enviar email:', error);
        throw new BadRequestException('Não foi possível enviar o email de redefinição.');
      }

      return { message: 'Se um utilizador com esse email existir, um link de redefinição será enviado.' };
    }


    async resetSenha(token: string, novaSenha: string): Promise<{ message: string }> {
      const resetSecret = this.configService.get<string>('JWT_PASSWORD_RESET_SECRET');

      try {
        const payload = this.jwtService.verify(token, {
          secret: resetSecret,
        }) as UsuarioPayload; 


        const userId = payload.sub;

        const novaSenhahash = await bcrypt.hash(novaSenha, 10);

        const dadosParaAtualizar = new EdicaoUsuarioDto();
        dadosParaAtualizar.senha = novaSenhahash;

        await this.usuarioService.editarUsuario(userId, dadosParaAtualizar);

        return { message: 'Senha redefinida com sucesso!' };

      } catch (error) {
        throw new ForbiddenException('Token inválido ou expirado.');
      }
    }
}
