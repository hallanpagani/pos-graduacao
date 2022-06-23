import { UsuarioDecorator } from '@app/comum';
import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CriarUsuarioDTO } from './dto/criar-usuario.dto';
import { EfetuarLoginDTO } from './dto/efetuar-login.dto';
import { criarPayloadDoUsuario } from './helper/auth';
import { Usuario } from './schema/usuario.schema';
import { UsuariosService } from './usuarios.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthService,
  ) {}

  @MessagePattern('registrar-usuario')
  async regitro(
    @Payload() userDTO: CriarUsuarioDTO,
    @Ctx() rmqContext: RmqContext,
  ) {
    //const chanel = rmqContext.getChannelRef();
    //const mensagemOriginal = rmqContext.getMessage();
    try {
      this.logger.debug('registrar-usuario');
      const usuario = await this.usuariosService.criarUsuario(userDTO);
      return { usuario };
     // await chanel.ack(mensagemOriginal);

      
    } catch (error) {
     // await chanel.ack(mensagemOriginal);
      throw new RpcException('Email já existe!');
    }
  }

  @MessagePattern('login-usuario')
  async login(
    @Payload() userDTO: EfetuarLoginDTO,
    @Ctx() rmqContext: RmqContext,
  ) {
    try {
      this.logger.debug('login-usuario');
      this.logger.log(JSON.stringify(userDTO));
      const user = await this.usuariosService.buscarUsuarioPorEmailSenha(
        userDTO,
      );
      this.logger.debug('user');
      this.logger.log(JSON.stringify(user));
      const payload = criarPayloadDoUsuario(user);
      /*const payload = {
      id: user._id.toString(),
      email: user.email,
      dono: user.dono,
    } */
      this.logger.log(JSON.stringify(payload));
      const token = await this.authService.criarTokenJWT(payload);
      return { user, token };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @EventPattern('ping-usuario')
  async ping(@Payload() user: Usuario, @Ctx() rmqContext: RmqContext): Promise<Usuario> {
    return user;
  }
}
