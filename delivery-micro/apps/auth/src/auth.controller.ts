import { UsuarioDecorator } from '@app/comum';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
