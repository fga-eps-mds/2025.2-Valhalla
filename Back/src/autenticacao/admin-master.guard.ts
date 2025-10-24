import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
// Verifica se o usuário é um administrador master
@Injectable()
export class AdminMasterGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    

    const request = context.switchToHttp().getRequest();
    
    const usuario = request.user;

    if (!usuario || !usuario.admMaster) {

      throw new UnauthorizedException('Acesso restrito a administradores master.');
    }

    return true;
  }
}