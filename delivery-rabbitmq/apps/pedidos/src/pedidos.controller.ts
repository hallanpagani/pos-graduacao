import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  //HttpCode,
  Param,
  Patch,
  Query,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  /*ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,*/
  ApiQuery,
} from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { AuthGuard } from '@nestjs/passport';
import { ClienteGuard, Usuario } from '@app/comum';

import { CreatePedidoDTO, ChangePedidoStatusDTO } from './dto/pedidos.dto';

import { Pedido } from './schema/pedidos.schema';
import { UsuarioDecorator } from '@app/comum/decorators/usuario.decorator';
import { EventPattern, MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('pedidos')
export class PedidosController {

  logger = new Logger(PedidosController.name)

  constructor(private pedidosService: PedidosService) {}

  //@MessagePattern('criar-pedido')
  @EventPattern('criar-pedido') /* Event based - Subscriber/Sem resposta para o Request */
  async criarPedido(@Body() payload, @UsuarioDecorator() user: Usuario) {
    try {
      this.logger.debug('criar-pedido')
      return await this.pedidosService.criarPedido(user, payload);
    } catch (error) {
      this.logger.debug('criar-pedido', error )
      throw new RpcException(error);
    }
  }

  @MessagePattern('buscar-pedidos-por-id-restaurante')
  async buscarTodosPedidosDoRestaurante(
    @Payload() payload,
  ): Promise<Pedido[]> {
    this.logger.warn('buscar-pedidos-por-id-restaurante')
    const { user, restauranteID } = payload;
    this.logger.debug('buscar-pedidos-por-id-restaurante user ' ,user )
    this.logger.debug('buscar-pedidos-por-id-restaurante restauranteID ',restauranteID )
    try {
      return await this.pedidosService.buscarTodosPedidosDoRestaurante(
        user,
        restauranteID,
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern('buscar-pedidos-por-id-pedido')
  async buscarPedidosPeloID(
    @Payload() payload
  ) {
    const user = payload.user;
    const pedidoID = payload.pedidoID;

    this.logger.debug('buscar-pedidos-por-id-pedido user ' ,user )
    this.logger.debug('buscar-pedidos-por-id-pedido pedidoID ' ,pedidoID )

    try {
      return await this.pedidosService.buscarPedidoPeloID(user, pedidoID);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern('atualizar-status-pedido')
  async atualizarStatus(
    @Payload() payload
  ) {
    const user = payload.user;
    const pedidoID = payload.pedidoID;
    const changeStatusDTO = payload.changeStatusDTO;
    this.logger.debug('criar-pedido', payload.user);
    this.logger.debug('criar-pedido', JSON.stringify( payload));

    try {
      return await this.pedidosService.atualizarStatus(
        user,
        pedidoID,
        changeStatusDTO,
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
