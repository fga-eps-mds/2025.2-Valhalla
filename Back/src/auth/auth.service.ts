import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { UsuarioDto } from 'src/usuario/dto/usuario.dto';
import { JwtService } from "@nestjs/jwt";
import { UsuarioPayload } from './models/UsuarioPayload';
import { UsuarioToken } from './models/UsuarioToken';
import { updateUsuarioDto } from 'src/usuario/dto/edicao.usuario.dto';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    constructor(private readonly usuarioService: UsuarioService, private readonly jwtService: JwtService, private readonly mailService: MailService,
      private readonly configService: ConfigService){}

     login(usuario: UsuarioDto): UsuarioToken {
        const payload: UsuarioPayload = {
            sub: usuario.id!,
            email: usuario.email,
            nome: usuario.nome,
        };
        const jwtToken = this.jwtService.sign(payload);
        
        return {
            access_token: jwtToken,
        }
    }
    
    async validateUser(email: string, senha: string) {
        const usuario = await this.usuarioService.procurarPorEmail(email);
        
        if (usuario) {
            const senhaValida = await bcrypt.compare(senha, usuario.senha)
            if (senhaValida){
            return {
                ...usuario,
                senha: undefined,
            }
        };
        }
        throw new Error('email ou senha inválidas')
    }

    async mudarSenha(usuarioId, senhaAntiga: string, senhaNova: string){
        const usuario = await this.usuarioService.encontrarUsuario(usuarioId)
        if (!usuario){
            throw new NotFoundException("usuario não encontrado")
        }

        const verificar = await bcrypt.compare(senhaAntiga, usuario.senha)
            if(!verificar) {
                throw new UnauthorizedException('credenciais erradas');
            }
        
        const novaSenhahash = await bcrypt.hash(senhaNova, 10);
        usuario.senha = novaSenhahash;
            
        const dadosParaAtualizar = new updateUsuarioDto();
        dadosParaAtualizar.senha = novaSenhahash

        await this.usuarioService.editarUsuario(usuario.id, dadosParaAtualizar);
        
    }
    async esqueciSenha(email: string): Promise<{ message: string }> {
      const usuario = await this.usuarioService.procurarPorEmail(email);

      if (!usuario) {
        return { message: 'Se um utilizador com esse email existir, um link de redefinição será enviado.' };
      }

      const payload: UsuarioPayload = { 
        sub: usuario.id!,
        email: usuario.email,
        nome: usuario.nome
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

        const dadosParaAtualizar = new updateUsuarioDto();
        dadosParaAtualizar.senha = novaSenhahash;

        await this.usuarioService.editarUsuario(userId, dadosParaAtualizar);

        return { message: 'Senha redefinida com sucesso!' };

      } catch (error) {
        throw new ForbiddenException('Token inválido ou expirado.');
      }
    }
}
