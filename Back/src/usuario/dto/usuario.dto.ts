import { IsEmail, IsEnum, isNotEmpty, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { CargoUsuario } from "@prisma/client";

export class UsuarioDto {
    @IsOptional()
    id: number
    
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsEnum(CargoUsuario)
    @IsNotEmpty()
    cargo: CargoUsuario;

    @IsString()
    @IsOptional()
    mediasrc: string;

    @IsNotEmpty({message: 'a senha não pode ser vazia'})
    @MinLength(8, {message: 'a senha tem que ter no mínimo 8 caracteres'})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.',
  })
    senha: string;
    
}