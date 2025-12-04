import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class NoticiasDto {
    @IsInt({message: 'O id do usuario deve ser um número'})
    @IsNotEmpty({message: 'O id do usuario nao pode estar vazio '})
    idUsuario:number;
}