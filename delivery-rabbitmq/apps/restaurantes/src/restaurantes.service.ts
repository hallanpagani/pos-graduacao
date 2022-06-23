//import { RestaurantesRepository } from './repository/restaurantes.repository';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CriarRestauranteDTO } from './dto/create-restaurante-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurante, RestauranteDocument } from './schema/restaurante.schema';
import { AtualizarRestauranteDTO } from './dto/atualizar-restaurante-dto';
import { Usuario, validateID } from '@app/comum';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RestaurantesService {
  protected readonly logger = new Logger(RestaurantesService.name);

  constructor(
    @InjectModel('Restaurante') private restauranteModel: Model<RestauranteDocument>,
  ) {}

  async buscarRestaurantes(user: Usuario): Promise<Restaurante[]> {
    const restaurantes = await this.restauranteModel.find({});
    return restaurantes;
  }

  async buscarRestaurantePorId(restauranteID:any): Promise<Restaurante> {
    validateID(restauranteID)
    this.logger.warn(restauranteID);
    const restaurante = await this.restauranteModel.findById({ _id: restauranteID });
    return restaurante;
  }

  async criarRestaurante(
    restauranteDTO : Restaurante
  ) {
    this.logger.warn(restauranteDTO); 
    //try
   // {
      return await this.restauranteModel.create(restauranteDTO);
   // } catch (error) {
   //   this.logger.error(error); 
     // throw new RpcException('Não foi possível criar o restaurante!')
  //  }

  }

  async atualizarRestaurante(
    restauranteID: string,
    restauranteDTO
  ) {
    this.logger.warn(restauranteID); 
    this.logger.warn(restauranteDTO); 
    validateID(restauranteID);
    const restaurante = await this.restauranteModel.findById(restauranteID);
    if (!restaurante) {
      return restaurante;
    }    
    await restaurante.updateOne(restauranteDTO.atualizarRestante);
    return await this.restauranteModel.findById(restauranteID);
  }

  async deletarRestaurantePorID(restauranteID: string) {
    const restaurante = await this.restauranteModel.findOneAndDelete({
      _id: restauranteID,
    });
    return restaurante;
  }

  async validarAcessoRestaurante(restauranteID: string, user: Usuario) {
    const restaurantList = await this.buscarRestaurantes(user);
    return restaurantList.some((elem) => elem._id.toString() == restauranteID);
  }
}
