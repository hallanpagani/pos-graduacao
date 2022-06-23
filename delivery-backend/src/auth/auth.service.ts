import { Payload } from 'src/auth/interfaces/payload';
import { UsuariosService } from './usuarios.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async criarTokenJWT(payload: Payload) : Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validarUsuario(payload: Payload) {
    return await this.userService.buscarUsuarioPeloEmailDoPayload(payload);
  }
}
