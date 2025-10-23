import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class criarCategoriasDto {

    @IsInt({ message: 'O idCategorias deve ser um numero.' }) // Perguntar pro Pedrão
    @IsNotEmpty({ message: 'O idCategorias não pode estar vazio.' }) // Perguntar pro Pedrão
    id: number;

    @IsString({ message: 'O nome deve ser um texto.' })
    @IsOptional()
    nome: string; // Do que se trata a denúncia "Falha tecnológica"

}