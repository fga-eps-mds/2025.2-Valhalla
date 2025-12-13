import { PartialType } from '@nestjs/mapped-types';
import { CreateApoioDenunciaDto } from './create-apoio-denuncia.dto';

export class UpdateApoioDenunciaDto extends PartialType(CreateApoioDenunciaDto) {}
