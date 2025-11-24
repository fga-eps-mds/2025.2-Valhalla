export interface UsuarioPayload{
    sub: number; //Padrão do JWT para o id do usuário
    email: string; //Email do usuário
    iat?:number; //Quando o token foi emitido
    exp?: number; //Quando o token expira
}