import { IsInt, IsString, IsOptional} from "class-validator";

export class edicaoNoticiasDto {

    @IsInt({message: 'O id do usuario deve ser um número.'})
    @IsOptional()
    idUsuario?:number;

    @IsString({message: 'A descricao deve ser um texto.'})
    @IsOptional()
    descricao?:string;

    @IsString({message: 'O tipo deve ser um texto.'})
    @IsOptional()
    tipo?:string;

    @IsString({message: 'A mediaSrc deve ser um texto.'})
    @IsOptional()
    mediaSrc?:string;
}