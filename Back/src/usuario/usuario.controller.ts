import { Controller, Body, Post, Delete, Param, UseGuards, Get, Patch, ParseIntPipe, Request } from '@nestjs/common';
import { CriacaoUsuarioDto } from './dto/usuario.dto';
import { UsuarioService } from './usuario.service';
import { EdicaoUsuarioDto } from './dto/edicao.usuario.dto';
import { IsPublic } from 'src/auth/decorators/isPublic.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { AuthRequest } from 'src/auth/models/authRequest';

@Controller('usuarios')
export class UsuarioController {
    
    constructor (private readonly usuarioService: UsuarioService){}

    @IsPublic()
    @Post()
    async criarUsuario(@Body() data:CriacaoUsuarioDto){
        return this.usuarioService.criarUsuario(data);
    }
        
    @Delete("delete-permanente/:id")
    @UseGuards(JwtAuthGuard)
    async deletarUsuario(
        @Request() req: AuthRequest,
        @Param("id", ParseIntPipe) id:number,
    ){
        return this.usuarioService.deletarUsuario(req.user.id, id, req.user.tipo);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    async desativarUsuario(
        @Request() req: AuthRequest,
        @Param("id", ParseIntPipe) id:number,
    ){
        return this.usuarioService.desativarUsuario(req.user.id, id, req.user.tipo);
    }

    @IsPublic()
    @Get(":id")
    async encontrarUsuario(@Param("id", ParseIntPipe) id:number) {
        return this.usuarioService.encontrarUsuario(Number(id));
    }
    @IsPublic()
    @Get()
    async listarUsuario() {
        return this.usuarioService.listarUsuario();
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async editarUsuario(
        @Request() req: AuthRequest,
        @Body() updateData: EdicaoUsuarioDto,
    ) {
        return this.usuarioService.editarUsuario(req.user.id, updateData);
    };
}

