import { HttpCode, HttpException, HttpStatus, Injectable, /*,Logger*/ 
Logger} from '@nestjs/common';
import { Usuario } from 'src/auth/schema/usuario.schema';
import { Restaurante } from './schema/restaurante.schema';
//import { validateID } from 'src/helpers/validators';
import { CriarRestauranteDTO } from './dto/criar-restaurante.dto';
import { AtualizarRestauranteDTO } from './dto/atualizar-restaurante.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { validateID } from 'src/helpers/validators';

@Injectable()
export class RestaurantesService {
  protected readonly logger = new Logger(RestaurantesService.name);

  constructor(
    @InjectModel('Restaurante') private restauranteModel: Model<Restaurante>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async buscarRestaurantes(user: Usuario): Promise<Restaurante[]> {
    /* if (user.dono) {
      // buscar restaurantes do dono
      return await this.restauranteModel.find({ donoID: user._id });
    }*/
    this.logger.warn('user : [' + user + ']');
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
      donoID: usuario,
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
    if (!restaurant) {
      throw new HttpException("Restaurante não encontrado", HttpStatus.NOT_FOUND);
      
    }

    await restaurant.updateOne(restauranteDTO);
    return await this.restauranteModel.findById(restauranteID);
  }

  async deletarRestaurantePorID(restauranteID: string) {
    const restaurante = await this.restauranteModel.findOneAndDelete({
      _id: restauranteID,
    });

    if (!restaurante){
      throw new HttpException('Restaurante não encontrado', HttpStatus.NOT_FOUND)
    }

    return restaurante; //await restaurante.deleteOne();
  }

  async validarAcessoRestaurante(restauranteID: string, user: Usuario) {
    const restaurantList = await this.buscarRestaurantes(user);
    return restaurantList.some((elem) => elem._id.toString() == restauranteID);
  }
}
