import { Controller, Body, Post, Delete, Param, UseGuards, Get, Patch, ParseIntPipe } from '@nestjs/common';
import { UsuarioDto } from './dto/usuario.dto';
import { UsuarioService } from './usuario.service';
import { updateUsuarioDto } from './dto/edicao.usuario.dto';

@Controller('Usuario')
export class UsuarioController {
    
    constructor (private readonly usuarioService: UsuarioService){}

    @Post()
    async criarUsuario(@Body() data:UsuarioDto){
        return this.usuarioService.criarUsuario(data);
    }
        
    @Delete(":id")
    async deletarUsuario(@Param("id") id:number) {
        return this.usuarioService.deletarUsuario(Number(id));
    }

    @Delete("soft-delete/:id")
    async desativarUsuario(@Param("id") id:number){
        return this.usuarioService.desativarUsuario(Number(id))
    }

    @Get(":id")
    async encontrarUsuario(@Param("id") id:number) {
        return this.usuarioService.encontrarUsuario(Number(id));
    }
    
    @Get()
    async listarUsuario() {
        return this.usuarioService.listarUsuario();
    }

    @Patch(':id')
    async editarUsuario(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: updateUsuarioDto,
    ) {
        return this.usuarioService.editarUsuario(id, updateData);
    };
}

