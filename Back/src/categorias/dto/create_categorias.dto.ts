import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class criarCategoriasDto {

    @IsInt({ message: 'O id deve ser um numero.' })
    @IsNotEmpty({ message: 'O id não pode estar vazio.' })
    id: number;

    @IsString({ message: 'O nome deve ser um texto.' })
    @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
    nome: string; 

}