import { IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class edicaoDenunciaDto {
    
    @IsString({ message: 'A descrição deve ser um texto.' })
    @IsOptional()  
    descricao?: string;
    
    @IsInt({ message: 'O idCategoria deve ser um numero.' })
    @IsOptional()  
    idCategoria?: number;

    @IsString({ message: 'A mediasrc deve ser um texto.' })
    @IsOptional()    
    mediasrc?: string;

    @IsBoolean({ message: 'O anonimato deve ser um booleano.' })
    @IsOptional()
    anonimato?: boolean;
}