import { AuthService } from 'src/auth/auth.service';
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  //ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CriarUsuarioDTO } from 'src/auth/dto/criar-usuario.dto';
import { UsuarioDecorator } from '../helpers/usuario.decorator';
import { Usuario } from 'src/auth/schema/usuario.schema';
import { criarPayloadDoUsuario } from 'src/auth/helper/auth';
import { UsuariosService } from './usuarios.service';
import { EfetuarLoginDTO } from './dto/efetuar-login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthService,
  ) {}

  @Post('registro')
  async regitro(@Body() userDTO: CriarUsuarioDTO) {
    await this.usuariosService.criarUsuario(userDTO);
  }

  @Post('login')
  async login(@Body() userDTO: EfetuarLoginDTO) {
    const user = await this.usuariosService.buscarUsuarioPorEmailSenha(userDTO);
    const payload = criarPayloadDoUsuario(user);
    /*const payload = {
      id: user._id.toString(),
      email: user.email,
      dono: user.dono,
    } */    
    const token = await this.authService.criarTokenJWT(payload);
    return { user, token };
  }

  @Get('/ping')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async ping(@UsuarioDecorator() user: Usuario): Promise<Usuario> {
    return user;
  }
}
