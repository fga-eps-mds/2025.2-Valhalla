import { IsString, IsNotEmpty, IsInt, IsOptional} from 'class-validator';
import { TipoNoticia } from '@prisma/client';

export class NoticiasDto {

    @IsString({message: 'A descricao deve ser um texto.'})
    @IsNotEmpty({message: 'A descricao nao pode estar vazia.'})
    descricao:string;

    @IsString({message: 'O tipo deve ser um texto.'})
    @IsNotEmpty({message: 'O tipo nao pode estar vazio.'})
    tipo:TipoNoticia;

    @IsString({ message: 'A mediaSrc deve ser um texto.' })
    @IsOptional()    
    mediaSrc?: string;
}