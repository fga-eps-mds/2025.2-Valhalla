import { IsInt, IsString, IsOptional, isInt } from "class-validator";

export class edicaoNoticiasDto {

    @IsInt({message: 'O id do usuario deve ser um número.'})
    @IsOptional()
    idUsuario:number;

    
}