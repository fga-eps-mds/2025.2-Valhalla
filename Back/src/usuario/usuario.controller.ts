import { Controller, Body, Post, Delete, Param } from '@nestjs/common';
import { UsuarioDto } from './dto/usuario.dto';
import { UsuarioService } from './usuario.service';

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
}
