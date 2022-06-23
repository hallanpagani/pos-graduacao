import { ObjectID } from 'bson';
import { HttpStatus, HttpException } from '@nestjs/common';

export const validateID = (id: string) => {
  if (!ObjectID.isValid(id)) {
    throw new HttpException(
      'Formato do "identificador" inválido',
      HttpStatus.BAD_REQUEST,
    );
  }
};
