import { IsString, IsNotEmpty, IsInt, IsOptional} from 'class-validator';

export class NoticiasDto {
    @IsInt({message: 'O id do usuario deve ser um número.'})
    @IsNotEmpty({message: 'O id do usuario nao pode estar vazio.'})
    idUsuario:number;

    @IsString({message: 'A descricao deve ser um texto.'})
    @IsNotEmpty({message: 'A descricao nao pode estar vazia.'})
    descricao:string;

    @IsString({message: 'O tipo deve ser um texto.'})
    @IsNotEmpty({message: 'O tipo nao pode estar vazio.'})
    tipo:string

    @IsString({ message: 'A mediaSrc deve ser um texto.' })
    @IsOptional()    
    mediaSrc?: string;
}