//import { sign } from 'jsonwebtoken';
import { Usuario } from '@app/comum';
import * as bcrypt from 'bcrypt';
import { Payload } from '../../../../../libs/comum/src/interfaces/payload';


export const LimparUsuario = (user) => {
  user.password = undefined;
  return user;
};

export const criarPayloadDoUsuario = (user: Usuario): Payload => {
  return {
    id: user.id,
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
