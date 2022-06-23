import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.dono) {
      return true;
    }

    throw new HttpException('Acesso negado para usuarios NÃO Administradores', HttpStatus.UNAUTHORIZED);
  }
}
