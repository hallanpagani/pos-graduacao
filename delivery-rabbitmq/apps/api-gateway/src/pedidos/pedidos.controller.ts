import { Usuario, UsuarioDecorator } from "@app/comum";
import { Body, Controller, Get, HttpException, HttpStatus, Inject, Logger, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { AuthGuard } from "@nestjs/passport";
import { ApiQuery } from "@nestjs/swagger";
import { SERVICO_PEDIDOS } from "./constante/servico";
import { ChangePedidoStatusDTO, CreatePedidoDTO } from "./dto/pedidos.dto";


@Controller('pedidos')
export class PedidosController {

  /*clientApiPedidosGateway : ClientProxy;
  
    constructor(
        clientApiPedidosGateway = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options:{
            urls:['amqps://hallanpagani:hallanpagani@b-0ea8fbbf-d952-48e5-b2e7-fa975bf0cc4c.mq.us-east-1.amazonaws.com:5671/micro-delivery'],
            queue: 'micro-auth'
            }
        })
    ) {} */

  private logger = new Logger(PedidosController.name);

  constructor(@Inject(SERVICO_PEDIDOS) private clientPedidos: ClientProxy) {}

    
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async criarPedido(
    @Body() criarPedidoDTO: CreatePedidoDTO,
    @UsuarioDecorator() user: Usuario,
  ) {
    try
    {
      return await this.clientPedidos.emit('criar-pedido',{user, criarPedidoDTO});
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  @ApiQuery({ name: 'restauranteID', required: false })
  @UseGuards(AuthGuard('jwt'))
  async buscarTodosPedidosDoRestaurante(
    @UsuarioDecorator() user: Usuario,
    @Query('restauranteID') restauranteID?,
  ) {
      this.logger.debug(`restauranteID ${JSON.stringify(restauranteID)}`);
      this.logger.debug(`user ${JSON.stringify(user)}`);
    try
    {
      return await this.clientPedidos.send('buscar-pedidos-por-id-restaurante',{user, restauranteID});
    } catch (error) {
      throw new HttpException('Pedidos não encontrados!', HttpStatus.NOT_FOUND);
    }
       
  } 

  @Get(':id?')
  @UseGuards(AuthGuard('jwt'))
  async buscarPedidosPeloID(@UsuarioDecorator() user: Usuario, @Param('id') pedidoID: string) {
    this.logger.debug(`buscarPedidosPeloID PedidoID ${JSON.stringify(pedidoID)}`);
    this.logger.debug(`buscarPedidosPeloID user ${JSON.stringify(user)}`);

    return await this.clientPedidos.send('buscar-pedidos-por-id-pedido',{user, pedidoID});
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async atualizarStatus(
    @UsuarioDecorator() user: Usuario,
    @Param('id') pedidoID: string,
    @Body() changeStatusDTO: ChangePedidoStatusDTO,
  ) {
    this.logger.debug(`PedidoID ${JSON.stringify(pedidoID)}`);
    this.logger.debug(`user ${JSON.stringify(pedidoID)}`);
    return await this.clientPedidos.send('atualizar-status-pedido',{
      user,
      pedidoID,
      changeStatusDTO}
    );
  }

}