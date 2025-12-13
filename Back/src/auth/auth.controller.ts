import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { AuthRequest } from './models/authRequest';
import { IsPublic } from './decorators/isPublic.decorator';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { MudarSenhaDto } from './dto/mudarSenha.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { esqueciSenhaDto } from './dto/esqueciSenha.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @IsPublic()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    login(@Request() req: AuthRequest , @Body() loginDto: LoginDto) {
        return this.authService.login(req.user, loginDto.lembrar);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('mudar-senha')
    async mudarSenha(@Req() req, @Body() MudarSenhaDto: MudarSenhaDto){
        return this.authService.mudarSenha(req.user?.id, MudarSenhaDto.senhaAntiga, MudarSenhaDto.senhaNova);
    }

    @IsPublic() 
    @Post('esqueci-senha')
    @HttpCode(HttpStatus.OK)
    async esqueciSenha(@Body() forgotPasswordDto: esqueciSenhaDto) {
      return this.authService.esqueciSenha(forgotPasswordDto.email);
    }


    @IsPublic() 
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      return this.authService.resetSenha(
        resetPasswordDto.token, 
        resetPasswordDto.novaSenha
      );
    }
}
