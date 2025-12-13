import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  senha: string;

  @IsBoolean()
  @IsOptional()
  lembrar?: boolean;
}