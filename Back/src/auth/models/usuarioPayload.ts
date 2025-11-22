export interface UsuarioPayload{
    sub: number; //Padrão do JWT para o id do usuário
    email: string;
    nome: string;
    tipo: string; // tipo de usuário (COMUM, ADMIN, ADMINMASTER)
    iat?:number; //Quando o token foi emitido
    exp?: number; //Quando o token expira
}