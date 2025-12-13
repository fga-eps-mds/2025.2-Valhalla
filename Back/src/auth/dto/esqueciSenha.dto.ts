import { IsEmail, IsNotEmpty } from "class-validator";

export class esqueciSenhaDto {
    @IsEmail()
    @IsNotEmpty({ message: 'O email não pode estar vazio.' })
    email: string;
}