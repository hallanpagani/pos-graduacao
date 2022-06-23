import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CriarUsuarioDTO } from './dto/criar-usuario.dto';
import { Payload } from './interfaces/payload';
import { EfetuarLoginDTO } from './dto/efetuar-login.dto';
import { validarPassword, LimparUsuario } from './helper/auth';
import { Usuario } from './schema/usuario.schema';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel('Usuario') private userModel: Model<Usuario>) {}

  async criarUsuario(criarUsuarioDTO: CriarUsuarioDTO): Promise<Usuario> {
    const { email } = criarUsuarioDTO;
    const usuario = await this.userModel.findOne({ email });
    if (usuario) {
      throw new RpcException('Email já existe!');
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
      throw new RpcException(
        'Credenciais não encontradas'
      );
    }
    return LimparUsuario(user);
  }

  async buscarUsuarioPeloEmailDoPayload(payload: Payload): Promise<Usuario> {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }
}
