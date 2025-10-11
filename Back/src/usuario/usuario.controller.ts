import { Controller, Body, Post, Delete, Param, UseGuards, Get } from '@nestjs/common';
import { UsuarioDto } from './dto/usuario.dto';
import { UsuarioService } from './usuario.service';
import { AdminMasterGuard } from 'src/autenticacao/admin-master.guard';

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
    
//Rota protegida para acesso apenas do adm
    @UseGuards(AdminMasterGuard)
    @Get('buscar/:email')
    async findByEmail(@Param('email') email: string) {
        return this.usuarioService.BuscarUsuarioPorEmail(email);
    }
}
