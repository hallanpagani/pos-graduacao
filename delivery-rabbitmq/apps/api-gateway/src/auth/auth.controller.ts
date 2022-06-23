import { UsuarioDecorator } from '@app/comum';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom} from 'rxjs';
import { SERVICO_AUTH } from './contantes/servico';
import { CriarUsuarioDTO } from './dtos/criar-usuario.dto';
import { EfetuarLoginDTO } from './dtos/efetuar-login.dto';
import { criarPayloadDoUsuario } from './helper/auth';
import { Usuario } from './interfaces/usuarios.interface';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(@Inject(SERVICO_AUTH) private clienteAuth: ClientProxy) {}

  @Post('registro')
  async regitro(@Body() userDTO: CriarUsuarioDTO) {
    this.logger.debug(JSON.stringify(userDTO));
    try {
      return await firstValueFrom(this.clienteAuth.send('registrar-usuario', userDTO));
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT)
    }
      
  }

  @Post('login')
  async login(@Body() userDTO: EfetuarLoginDTO) {
    try {
      //return await this.clienteAuth.send('login-usuario', userDTO).toPromise();
      return await firstValueFrom(this.clienteAuth.send('login-usuario', userDTO))
    } catch (error) {
      throw new HttpException( error.message , 404)
    }
  }

  @Get('/ping')
  @UseGuards(AuthGuard('jwt'))
  async ping(@UsuarioDecorator() user: Usuario): Promise<Usuario> {
    return await firstValueFrom(this.clienteAuth.send('ping-usuario', user))
  }
}
