import { IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class edicaoCategoriasDto {

    @IsString({ message: 'O nome deve ser um texto.' })
    @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
    nome: string; 

}