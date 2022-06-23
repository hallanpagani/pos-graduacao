//import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Payload } from '../interfaces/payload';
import { Usuario } from '../schema/usuario.schema';

export const LimparUsuario = (user) => {
  user.password = undefined;
  return user;
};

export const criarPayloadDoUsuario = (user: Usuario): Payload => {
  return {
    id: user._id.toString(),
    email: user.email,
    dono: user.dono,
  };
};

export const validarPassword = async (
  password: string,
  userPassword: string,
): Promise<any> => {
  return await bcrypt.compare(password, userPassword);
};

/*export const signJWT = async (user: Usuario) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    dono: user.dono,
  };
  return sign(payload, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};*/
