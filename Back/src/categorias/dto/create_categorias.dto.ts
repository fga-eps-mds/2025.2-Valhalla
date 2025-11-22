import { IsString, IsNotEmpty } from 'class-validator';

export class criarCategoriasDto {

    @IsString({ message: 'O nome deve ser um texto.' })
    @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
    nome: string; 

}