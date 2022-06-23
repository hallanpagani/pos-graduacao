//import { RestaurantesRepository } from './repository/restaurantes.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CriarRestauranteDTO } from './dto/create-restaurante-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurante } from './schema/restaurante.schema';
import { AtualizarRestauranteDTO } from './dto/atualizar-restaurante-dto';
import { Usuario, validateID } from '@app/comum';

@Injectable()
export class RestaurantesService {
  //protected readonly logger = new Logger(RestaurantesService.name);

  constructor(
    @InjectModel('Restaurante') private restauranteModel: Model<Restaurante>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async buscarRestaurantes(user: Usuario): Promise<Restaurante[]> {
    /* if (user.dono) {
    // buscar restaurantes do dono
    return await this.restauranteModel.find({ donoID: user._id });
  }*/
    /* this.logger.warn(this.buscarRestaurantes.name + ': [' + user + ']'); */
    return await this.restauranteModel.find({});
  }

  async buscarRestaurantePorId(restauranteID: string): Promise<Restaurante> {
    //validateID(restauranteID);
    return await this.restauranteModel.findById({ _id: restauranteID });
    //.populate('donoID');
  }

  async criarRestaurante(
    restauranteDTO: CriarRestauranteDTO,
    usuario: Usuario,
  ): Promise<Restaurante> {
    const criarRestaurante = {
      donoID: usuario.id,
      //produtos: [Produto],
      ...restauranteDTO,
    };
    return await this.restauranteModel.create(criarRestaurante);
  }

  async atualizarRestaurante(
    restauranteID: string,
    restauranteDTO: AtualizarRestauranteDTO,
  ): Promise<Restaurante> {
    validateID(restauranteID);
    const restaurant = await this.restauranteModel.findById(restauranteID);
    await restaurant.updateOne(restauranteDTO);
    return await this.restauranteModel.findById(restauranteID);
  }

  async deletarRestaurantePorID(restauranteID: string) {
    const restaurante = await this.restauranteModel.findOneAndDelete({
      _id: restauranteID,
    });

    if (!restaurante) {
      throw new HttpException(
        'Restaurante não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return restaurante; //await restaurante.deleteOne();
  }

  async validarAcessoRestaurante(restauranteID: string, user: Usuario) {
    const restaurantList = await this.buscarRestaurantes(user);
    return restaurantList.some((elem) => elem._id.toString() == restauranteID);
  }
}
