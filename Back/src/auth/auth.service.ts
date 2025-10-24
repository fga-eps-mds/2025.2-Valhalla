import { Injectable } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(private readonly usuarioService: UsuarioService){}
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
