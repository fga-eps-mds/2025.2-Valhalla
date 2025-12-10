import { Injectable } from '@nestjs/common';
import { CreateApoioDenunciaDto } from './dto/create-apoio-denuncia.dto';
import { UpdateApoioDenunciaDto } from './dto/update-apoio-denuncia.dto';

@Injectable()
export class ApoioDenunciaService {
  create(createApoioDenunciaDto: CreateApoioDenunciaDto) {
    return 'This action adds a new apoioDenuncia';
  }

  findAll() {
    return `This action returns all apoioDenuncia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apoioDenuncia`;
  }

  update(id: number, updateApoioDenunciaDto: UpdateApoioDenunciaDto) {
    return `This action updates a #${id} apoioDenuncia`;
  }

  remove(id: number) {
    return `This action removes a #${id} apoioDenuncia`;
  }
}
