import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CriarUsuarioDTO } from './dto/criar-usuario.dto';
import { Payload } from './interfaces/payload';
import { EfetuarLoginDTO } from './dto/efetuar-login.dto';
import { validarPassword, LimparUsuario } from './helper/auth';
import { Usuario } from './schema/usuario.schema';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel('Usuario') private userModel: Model<Usuario>) {}

  async criarUsuario(criarUsuarioDTO: CriarUsuarioDTO): Promise<Usuario> {
    const { email } = criarUsuarioDTO;
    const usuario = await this.userModel.findOne({ email });
    if (usuario) {
      throw new HttpException(
        'Email já existe!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const createdUser = new this.userModel(criarUsuarioDTO);
    await createdUser.save();
    //return LimpaUsuario(createdUser);
    return createdUser;
  }

  async buscarUsuarioPorEmailSenha(userDTO: EfetuarLoginDTO): Promise<Usuario> {
    const { email, password } = userDTO;
    const user = await this.userModel.findOne({ email });

    if (!user || (await validarPassword(password, user.password)) === false) {
      throw new HttpException(
        'Credenciais não encontradas',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return LimparUsuario(user);
  }

  async buscarUsuarioPeloEmailDoPayload(payload: Payload): Promise<Usuario> {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }
}
