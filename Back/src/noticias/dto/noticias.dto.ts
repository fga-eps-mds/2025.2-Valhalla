import { IsString, IsNotEmpty, IsInt, IsOptional, isString } from 'class-validator';

export class NoticiasDto {
    @IsInt({message: 'O id do usuario deve ser um número'})
    @IsNotEmpty({message: 'O id do usuario nao pode estar vazio'})
    idUsuario:number;

    @IsString({message: 'A descricao deve ser um texto'})
    @IsNotEmpty({message: 'A descricao nao pode estar vazia'})
    descricao:string;
}