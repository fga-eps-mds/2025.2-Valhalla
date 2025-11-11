export interface UsuarioPayload{
    sub: number;
    email: string;
    nome: string;
    iat?:number;
    exp?: number
}