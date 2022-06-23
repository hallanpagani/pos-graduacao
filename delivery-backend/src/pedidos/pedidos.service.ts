import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidarStatusAtualPedido } from 'src/helpers/pedidos';
import { Pedido } from 'src/pedidos/schema/pedidos.schema';
import { ProdutosService } from 'src/restaurantes/produtos.service';
import {
  CreatePedidoDTO,
  ChangePedidoStatusDTO,
} from 'src/pedidos/dto/pedidos.dto';
import { Usuario } from 'src/auth/schema/usuario.schema';

import { RestaurantesService } from '../restaurantes/restaurantes.service';
import { validateID } from 'src/helpers/validators';
import { isLongitude } from 'class-validator';
import { HistoricoPedido } from './schema/historico.schema';

@Injectable()
export class PedidosService {
  constructor(
    @InjectModel('Pedido') private PedidoModel: Model<Pedido>,
    private produtosService: ProdutosService,
    private restaurantesService: RestaurantesService,
  ) {}
  async criarPedido(user: Usuario, createDTO: CreatePedidoDTO) {
    const { restauranteID, endereco, produtos } = createDTO;
    const restaurante = await this.restaurantesService.buscarRestaurantePorId(restauranteID);
    if (!restaurante) {
      throw new HttpException('Restaurante não encontrado',HttpStatus.NOT_FOUND)
    }

    // if (
    //   !(await this.restaurantesService.validarAcessoRestaurante(
    //     restauranteID,
    //     user,
    //   ))
    // ) {
    //   throw new HttpException(
    //     'Restaurante não encontrado',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
    // if (
    //   !(await this.produtosService.validarProdutosParaOMesmoRestaurante(
    //     produtos,
    //     restauranteID._id.toString(),
    //   ))
    // ) {
    //   throw new HttpException(
    //     'Invalid products',
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }
    const criarPedido = {
      usuarioID: user._id,
      produtos : produtos,
      preco_total: 0,
      endereco,
      status: 'Solicitado',
      historico_status: [ { status: 'Solicitado' }],
      restauranteID: restauranteID,
      criado_em: Date.now(),
    };
    const { _id } = await this.PedidoModel.create(criarPedido);
    let Pedido = await this.PedidoModel.findById(_id);
   // .populate(
   //   'produtos',
   // );
    const preco_total = produtos.reduce((acc, produtoObj) => {
      const _preco = produtoObj.preco * produtoObj.quantidade;
      return acc + _preco;
    }, 0);
    await Pedido.updateOne({ preco_total });
    Pedido = await this.PedidoModel.findById(_id); //.populate('produtos');
    return Pedido;
  }

  async buscarTodosPedidosDoRestaurante(user: Usuario, restauranteID?: string) {
    if (user.dono) {
      if (restauranteID) {
        // if (
        //   !(await this.restaurantesService.validarAcessoRestaurante(
        //     restauranteID,
        //     user,
        //   ))
        // ) {
        //   throw new HttpException('Restaurante não encontrado', HttpStatus.NOT_FOUND);
        // }
        return await this.PedidoModel.find({
          restaurant: restauranteID,
        })
          .populate('usuarioID')      
          //.populate('produtos.produtoID')
          //.populate('restauranteID')
          .sort({ createdAt: -1 });  
      }
      const restaurantList = await this.restaurantesService.buscarRestaurantes(
        user,
      );
      const ids = restaurantList.map((restaurant) => restaurant._id);
      return await this.PedidoModel.find({
        restauranteID: { $in: ids },
      })
        .populate('restauranteID')
        .sort({ createdAt: -1 });
    }
    return this.PedidoModel.find({
      _id: user._id,
    })
      .populate('restauranteID')
      .sort({ createdAt: -1 });
  }

  async buscarPedidoPeloID(user: Usuario, PedidoID: string): Promise<Pedido> {
    validateID(PedidoID);
    const Pedido = await this.PedidoModel.findById({ _id: PedidoID })
      .populate('produtos.produtoID')
      .populate('restauranteID')
      .populate('usuarioID');
    if (!Pedido) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }
    await this.validateUserAccessToPedido(user, Pedido);
    return Pedido;
  }

  async atualizarStatus(
    user: Usuario,
    PedidoID: string,
    changeStatusDTO: ChangePedidoStatusDTO,
  ): Promise<Pedido> {
    const _pedido = await this.buscarPedidoPeloID(user, PedidoID);
   // const { status: antigoStatus } = _pedido;
    const { status: novoStatus } = changeStatusDTO;
   /* if (!ValidarStatusAtualPedido(user.dono, novoStatus, antigoStatus)) {
      throw new HttpException(
        `Não é possível modificar o status ${novoStatus}`,
        HttpStatus.FORBIDDEN,
      );
    } */
    const { historico_status } = _pedido;
    historico_status.push({
      status: novoStatus,
      criado_em: new Date(),
    }); 
    
    await this.PedidoModel.findById(_pedido._id).updateOne({ ...changeStatusDTO,  historico_status });

    return await this.buscarPedidoPeloID(user, PedidoID);
  }
  
  async validateUserAccessToPedido(user: Usuario, Pedido: Pedido) {
    if (user.dono) {
      if (
        !(await this.restaurantesService.validarAcessoRestaurante(
          Pedido.restauranteID._id.toString(),
          user,
        ))
      ) {
        throw new HttpException(
          'Restaurante não encontrado',
          HttpStatus.FORBIDDEN,
        );
      }
      return true;
    }
    if (Pedido.usuarioID._id != user._id) {
      throw new HttpException('Pedido não encontrado', HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
