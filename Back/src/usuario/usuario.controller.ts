import { Controller, Body, Post, Delete, Param, UseGuards, Get, Patch, ParseIntPipe, Request } from '@nestjs/common';
import { CriacaoUsuarioDto } from './dto/usuario.dto';
import { UsuarioService } from './usuario.service';
import { EdicaoUsuarioDto } from './dto/edicao.usuario.dto';
import { IsPublic } from 'src/auth/decorators/isPublic.decorator';
import { AuthRequest } from 'src/auth/models/authRequest';
import { DefaultValuePipe } from '@nestjs/common/pipes/default-value.pipe';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';

@Controller('usuarios')
export class UsuarioController {
    
    constructor (private readonly usuarioService: UsuarioService){}

    @IsPublic()
    @Post()
    async criarUsuario(@Body() data:CriacaoUsuarioDto){
        return this.usuarioService.criarUsuario(data);
    }

    @Post('admin')
    async criarAdmin(
        @Body() data:CriacaoUsuarioDto,
        @Request() req: AuthRequest
    ){
        return this.usuarioService.criarUsuario(data, {tipo: req.user.tipo});
    }
        
    @Delete("delete-permanente/:id")
    async deletarUsuario(
        @Request() req: AuthRequest,
        @Param("id", ParseIntPipe) id:number,
    ){
        return this.usuarioService.deletarUsuario(req.user.id, id, req.user.tipo);
    }

    @Delete(":id")
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
    async listarUsuario(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
    ) {
        return this.usuarioService.listarUsuario(page, limit);
    }

    @Patch()
    async editarUsuario(
        @Request() req: AuthRequest,
        @Body() updateData: EdicaoUsuarioDto,
    ) {
        return this.usuarioService.editarUsuario(req.user.id, updateData, {senha: false});
    };
}

