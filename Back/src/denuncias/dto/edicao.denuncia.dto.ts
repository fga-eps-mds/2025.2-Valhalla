import { IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class edicaoDenunciaDto {
    
    @IsString({ message: 'A descrição deve ser um texto.' })
    @IsNotEmpty({ message: 'A descrição não pode estar vazia.' })
    @IsOptional()  
    descricao: string;
    
    @IsInt({ message: 'O idCategoria deve ser um numero.' })
    @IsNotEmpty({ message: 'O idCategoria não pode estar vazio.' })
    @IsOptional()  
    idCategoria: number;

    @IsString({ message: 'A mediasrc deve ser um texto.' })
    @IsOptional()    
    mediasrc?: string;

    @IsBoolean({ message: 'O anonimato deve ser um booleano.' })
    @IsOptional()
    anonimato?: boolean;
}