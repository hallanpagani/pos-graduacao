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
import { Usuario } from 'src/auth/schema/usuario.schema';

import {
  CreatePedidoDTO,
  ChangePedidoStatusDTO,
} from 'src/pedidos/dto/pedidos.dto';

import { Pedido } from 'src/pedidos/schema/pedidos.schema';
import { UsuarioDecorator } from 'src/helpers/usuario.decorator';
//import { ClientGuard } from 'src/guards/client.guard';

/*
  @HttpCode(201)
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  @ApiNotFoundResponse({ description: 'Pedido não encontrado' })
  @ApiForbiddenResponse({ description: 'Sem acesso ao pedido' })
  @ApiBadRequestResponse({ description: 'Campos inválidos' })
  @ApiOperation({ summary: 'Buscar pedido' })
  @ApiOkResponse({ description: 'Lista de pedidos' }) 
*/

@ApiTags('Pedidos')
@Controller('pedidos')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PedidosController {
  constructor(private pedidosService: PedidosService) {}

  @Post()
 @UseGuards(AuthGuard('jwt')) 
  async criarPedido(
    @Body() criarPedidoDTO: CreatePedidoDTO,
    @UsuarioDecorator() user: Usuario,
  ) {
    return await this.pedidosService.criarPedido(user, criarPedidoDTO);
  }

  @Get()
  @ApiQuery({ name: 'restauranteID', required: false })
  async buscarTodosPedidosDoRestaurante(
    @UsuarioDecorator() user: Usuario,
    @Query('restauranteID') restauranteID?,
  ): Promise<Pedido[]> {
    return await this.pedidosService.buscarTodosPedidosDoRestaurante(user, restauranteID);
  }

  @Get(':id')
  async buscarPedidosPeloID(@UsuarioDecorator() user: Usuario, @Param('id') pedidoID: string) {
    return await this.pedidosService.buscarPedidoPeloID(user, pedidoID);
  }

  @Patch(':id')
  async atualizarStatus(
    @UsuarioDecorator() user: Usuario,
    @Param('id') pedidoID: string,
    @Body() changeStatusDTO: ChangePedidoStatusDTO,
  ) {
    return await this.pedidosService.atualizarStatus(
      user,
      pedidoID,
      changeStatusDTO,
    );
  }
}
