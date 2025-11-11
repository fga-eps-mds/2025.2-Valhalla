import { IsEmail, isNotEmpty, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class updateUsuarioDto {

    @IsString()
    @IsOptional()
    mediasrc: string;

    @IsString()
    @IsOptional()
    senha: string

}