import { Injectable } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { UsuarioDto } from 'src/usuario/dto/usuario.dto';
import { JwtService } from "@nestjs/jwt";
import { UsuarioPayload } from './models/UsuarioPayload';
import { UsuarioToken } from './models/UsuarioToken';
@Injectable()
export class AuthService {
    constructor(private readonly usuarioService: UsuarioService, private readonly jwtService: JwtService){}

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
}
