import { IsNotEmpty, IsString, IsIn, Matches, MinLength } from "class-validator";

export class MudarSenhaDto {

  @IsString()
  @IsNotEmpty()
  senhaAntiga: string;

  @IsNotEmpty({ message: 'A senha não pode ser vazia' })
  @MinLength(8, { message: 'A senha tem que ter no mínimo 8 caracteres' })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { 
      message: 'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.',
    },
  )
  senhaNova: string;
}