import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string; 

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'A senha tem que ter no mínimo 8 caracteres' })
    @Matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      { 
        message: 'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.',
      },
    )
  novaSenha: string;
}