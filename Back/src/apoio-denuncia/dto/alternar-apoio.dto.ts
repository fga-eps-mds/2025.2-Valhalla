import { IsInt, IsNotEmpty } from 'class-validator';

export class AlternarApoioDto {
  @IsInt()
  @IsNotEmpty()
  idDenuncia: number;

  @IsInt()
  @IsNotEmpty()
  idUsuario: number;
}