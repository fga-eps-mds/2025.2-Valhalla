import { Controller, Body, Post, Delete, Param, UseGuards, Get, Patch, ParseIntPipe } from '@nestjs/common';
import { UsuarioDto } from './dto/usuario.dto';
import { UsuarioService } from './usuario.service';
import { updateUsuarioDto } from './dto/edicao.usuario.dto';

@Controller('Usuario')
export class UsuarioController {
    
    constructor (private readonly usuarioService: UsuarioService){}

    @Post()
    async create(@Body() data:UsuarioDto){
        return this.usuarioService.CriarUsuario(data);
    }
        
    @Delete(":id")
    async delete(@Param("id") id:number) {
        return this.usuarioService.DeletarUsuario(Number(id));
    }

    @Get(":id")
    async FindOne(@Param("id") id:number) {
        return this.usuarioService.FindOne(Number(id));
    }
    
    @Get()
    async findAll() {
        return this.usuarioService.findAll();
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: updateUsuarioDto,
    ) {
        return this.usuarioService.update(id, updateData);
    };
}

