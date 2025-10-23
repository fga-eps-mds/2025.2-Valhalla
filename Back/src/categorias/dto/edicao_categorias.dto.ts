import { IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class edicaoCategoriasDto {

    @IsInt({message: 'O Id deve ser um numero'})
    @IsNotEmpty({ message: 'O Id não pode estar vazio.' })
    id: number;

    @IsString({ message: 'O nome deve ser um texto.' })
    @IsOptional()
    nome: string; //Do que se trata a nova categoria

}