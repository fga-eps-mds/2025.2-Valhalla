import { IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class DenunciaDto {

    @IsString({ message: 'A descrição deve ser um texto.' })
    @IsNotEmpty({ message: 'A descrição não pode estar vazia.' })
    descricao: string;
    
    @IsInt({ message: 'O idCategoria deve ser um numero.' })
    @IsNotEmpty({ message: 'O idCategoria não pode estar vazio.' })
    idCategoria: number;

    @IsString({ message: 'A mediaSrc deve ser um texto.' })
    @IsOptional()    
    mediaSrc?: string;

    @IsBoolean({ message: 'O anonimato deve ser um booleano.' })
    @IsOptional()
    anonimato?: boolean;
}