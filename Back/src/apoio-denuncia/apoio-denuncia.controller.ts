import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApoioDenunciaService } from './apoio-denuncia.service';
import { CreateApoioDenunciaDto } from './dto/create-apoio-denuncia.dto';
import { UpdateApoioDenunciaDto } from './dto/update-apoio-denuncia.dto';

@Controller('apoio-denuncia')
export class ApoioDenunciaController {
  constructor(private readonly apoioDenunciaService: ApoioDenunciaService) {}

  @Post()
  create(@Body() createApoioDenunciaDto: CreateApoioDenunciaDto) {
    return this.apoioDenunciaService.create(createApoioDenunciaDto);
  }

  @Get()
  findAll() {
    return this.apoioDenunciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apoioDenunciaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApoioDenunciaDto: UpdateApoioDenunciaDto) {
    return this.apoioDenunciaService.update(+id, updateApoioDenunciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apoioDenunciaService.remove(+id);
  }
}
