import { IsInt, IsString, IsOptional} from "class-validator";
import { TipoNoticia } from "@prisma/client";

export class EdicaoNoticiasDto {

    @IsInt({message: 'O id do usuario deve ser um número.'})
    @IsOptional()
    idUsuario?:number;

    @IsString({message: 'A descricao deve ser um texto.'})
    @IsOptional()
    descricao?:string;

    @IsString({message: 'O tipo deve ser um texto.'})
    @IsOptional()
    tipo?:TipoNoticia;

    @IsString({message: 'A mediaSrc deve ser um texto.'})
    @IsOptional()
    mediaSrc?:string;
}