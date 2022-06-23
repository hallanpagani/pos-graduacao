import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//import { ValidarStatusAtualPedido } from './helpers/pedidos';
import { Pedido } from './schema/pedidos.schema';
import { CreatePedidoDTO, ChangePedidoStatusDTO } from './dto/pedidos.dto';
import { Usuario, validateID } from '@app/comum';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PedidosService {
  
  logger = new Logger(PedidosService.name);
  
  constructor(
    @InjectModel('Pedido') private PedidoModel: Model<Pedido>, //private produtosService: ProdutosService, //private restaurantesService: RestaurantesService,
  ) {}
  async criarPedido(user: Usuario, createDTO) {
   
    this.logger.debug(`user  ${JSON.stringify(user)}`)
    this.logger.debug(`createDTO ${JSON.stringify(createDTO)}`)

    const produtos = createDTO.criarPedidoDTO.produtos;
    const restauranteID = createDTO.criarPedidoDTO.restauranteID;
    const endereco = createDTO.criarPedidoDTO.endereco;

    this.logger.debug(`restauranteID ${restauranteID}`)
    this.logger.debug(`endereco ${endereco}`)
    this.logger.debug(`produtos ${produtos}`)

    this.logger.debug(`userid  ${JSON.stringify(user.id)}`)

    try {
      const criarPedido = {
        usuarioID: user.id,
        produtos: produtos,
        preco_total: 0,
        endereco,
        status: 'Solicitado',
        historico_status: [{ status: 'Solicitado' }],
        restauranteID: restauranteID,
        criado_em: Date.now(),
      };
      this.logger.log(`produtos ${criarPedido}`)
      const { id } = await this.PedidoModel.create(criarPedido);
      let Pedido = await this.PedidoModel.findById(id);
      const preco_total = produtos.reduce((acc, produtoObj) => {
        const _preco = produtoObj.preco * produtoObj.quantidade;
        return acc + _preco;
      }, 0);
      await Pedido.updateOne({ preco_total });
      Pedido = await this.PedidoModel.findById(id); //.populate('produtos');
      return Pedido;
    } catch (error) {
      throw new RpcException(error);
    }
      

  }

  async buscarTodosPedidosDoRestaurante(user: Usuario, restauranteID?: string) {
    this.logger.debug(`buscarTodosPedidosDoRestaurante restauranteID ${JSON.stringify(restauranteID)}`)
    this.logger.debug(`buscarTodosPedidosDoRestaurante user ${JSON.stringify(user)}`)
   // if (user.dono) {
      if (restauranteID) {
        return await this.PedidoModel.find({ restauranteID: restauranteID })
          .sort({ createdAt: -1 });
      }
   // }
    return await this.PedidoModel.find({});
  }

  async buscarPedidoPeloID(user: Usuario, PedidoID: string): Promise<Pedido> {

    this.logger.debug(`buscarPedidoPeloID PedidoID ${JSON.stringify(PedidoID)}`)
    this.logger.debug(`buscarPedidoPeloID user ${JSON.stringify(user)}`)
    
    validateID(PedidoID);
    const Pedido = await this.PedidoModel.findById({ _id: PedidoID });
    if (!Pedido) {
      throw new RpcException('Pedido não encontrado!');
    }
     return Pedido;
  }

  async atualizarStatus(
    user: Usuario,
    PedidoID: string,
    changeStatusDTO: ChangePedidoStatusDTO,
  ): Promise<Pedido> {
    this.logger.debug(`PedidoID ${JSON.stringify(PedidoID)}`);
    this.logger.debug(`user ${JSON.stringify(user)}`);
    this.logger.debug(`changeStatusDTO ${JSON.stringify(changeStatusDTO)}`);

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

    await this.PedidoModel.findById(_pedido._id).updateOne({
      ...changeStatusDTO,
      historico_status,
    });

    return await this.buscarPedidoPeloID(user, PedidoID);
  }

}
