import { IsEmail, IsOptional, IsString, IsNotEmpty, MinLength, Matches } from "class-validator";

export class EdicaoUsuarioDto {

    @IsString()
    @IsOptional( {message: 'O nome não pode estar vazio.' })
    nome?: string;

    @IsEmail({}, { message: 'Forneça um e-mail válido.' })
    @IsOptional({ message: 'O e-mail não pode estar vazio.' })
    email?: string;

    @IsString()
    @IsOptional()
    mediaSrc?: string;

    @IsOptional()
    @MinLength(8, {message: 'a senha tem que ter no mínimo 8 caracteres'})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.',})
    senha?: string;

}