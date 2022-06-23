import { Restaurante } from '../schema/restaurante.schema';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/comum';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class RestaurantesRepository extends AbstractRepository<Restaurante> {
  protected readonly logger = new Logger(RestaurantesRepository.name);

  constructor(
    @InjectModel(Restaurante.name) restauranteModel: Model<Restaurante>,
    @InjectConnection() connection: Connection,
  ) {
    super(restauranteModel, connection);
  }
}
