import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { CargoUsuario, TipoUsuario } from "@prisma/client";

export class CriacaoUsuarioDto {

    @IsString()
    @IsNotEmpty( {message: 'O nome não pode estar vazio.' })
    nome: string;

    @IsEmail({}, { message: 'Forneça um e-mail válido.' })
    @IsNotEmpty({ message: 'O e-mail não pode estar vazio.' })
    email: string;

    @IsNotEmpty({message: 'a senha não pode ser vazia'})
    @MinLength(8, {message: 'a senha tem que ter no mínimo 8 caracteres'})
    @Matches(/^\S+$/, {message: 'A senha não pode conter espaços em branco ou quebras de linha.'})
    @Matches(/(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.'})
    senha: string;

    @IsEnum(CargoUsuario)
    @IsNotEmpty()
    cargo: CargoUsuario;

    @IsEnum(TipoUsuario)
    @IsOptional()
    tipo?: TipoUsuario; //Padrão do DB é COMUM

    @IsString()
    @IsOptional()
    mediaSrc?: string;

}