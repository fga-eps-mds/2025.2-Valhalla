import { IsInt, IsNotEmpty} from "class-validator";


export class reportDenunciasDto {
    @IsInt()
    @IsNotEmpty()
    idUsuario: number;

    @IsInt()
    @IsNotEmpty()
    idDenuncia:number;

}