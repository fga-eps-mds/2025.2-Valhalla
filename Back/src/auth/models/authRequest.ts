import { Request } from "express";
import { Usuario } from "@prisma/client";

export class AuthRequest extends Request{
    user: Usuario; // Busca diretamente do banco de dados
}