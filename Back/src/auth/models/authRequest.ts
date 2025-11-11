import { Request } from "express";
import { UsuarioDto } from "src/usuario/dto/usuario.dto";

export class AuthRequest extends Request{
    user: UsuarioDto
}