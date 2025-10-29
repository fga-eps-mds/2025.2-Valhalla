import { IsEmail } from "class-validator";

export class esqueciSenhaDto {
    @IsEmail()
    email: string;
}