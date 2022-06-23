import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CriarRestauranteDTO } from './dto/create-restaurante-dto';
import { RestaurantesService } from './restaurantes.service';
import { Restaurante } from './schema/restaurante.schema';
import { UsuarioDecorator } from '@app/comum/decorators/usuario.decorator';
import { AtualizarRestauranteDTO } from './dto/atualizar-restaurante-dto';
import { AuthGuard } from '@nestjs/passport';
import { CriarRestauranteProdutoDTO } from './dto/criar-produtos.dto';
import { Usuario } from '@app/comum';
import { DonoGuard } from '@app/comum/guards/dono.guard';
import { ProdutosService } from './produtos.service';
import { Produto } from './schema/produto.schema';
import { ClientProxy, Ctx, EventPattern, MessagePattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { ContextIdFactory } from '@nestjs/core';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SERVICO_RESTAURANTE } from './constantes/servico';

@Controller('restaurantes')
export class RestaurantesController {

  private logger = new Logger(RestaurantesController.name)

  constructor(
    private readonly restauranteService: RestaurantesService,
    private readonly produtosService: ProdutosService,
    @Inject(SERVICO_RESTAURANTE) private clientRestaurante: ClientProxy
  ) {}

  @MessagePattern('criar-restaurante')   /* request/reply */
  async criarRestaurante(
   @Payload() payload
  ) {
    try{
      Logger.log('criar-restaurante'+JSON.stringify(payload));  
      return await this.restauranteService.criarRestaurante(payload);
    } catch (error) {
      Logger.log(error); 
      throw new RpcException(error)
    }
  }
  
  @MessagePattern('buscar-restaurantes')  /* request/reply */
  async buscarTodosRestaurantes(
    @Payload() payload: any,
    @Ctx() ctx: RmqContext
    ) {
    this.logger.debug('buscar-restaurante'+JSON.stringify(payload));
    if (payload.restauranteID) {
      return await this.restauranteService.buscarRestaurantePorId(payload.restauranteID); 
    }
    this.logger.debug('buscar-restaurante sem restaurante ID');
    return this.restauranteService.buscarRestaurantes(payload.restauranteID);
  }

  @MessagePattern('atualizar-restaurante') /* request/reply */
  async atualizarRestaurante(
    @Payload() payload,
    @Ctx() ctx: RmqContext
  ): Promise<Restaurante> {
    this.logger.debug('atualizar-restaurante'+JSON.stringify(payload));
    try {
      return this.restauranteService.atualizarRestaurante( payload.restauranteID, payload );
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @MessagePattern('deletar-restaurante') /* request/reply */
  async deletarRestaurante(
    @Payload() payload: any,
    @Ctx() ctx: RmqContext
  ) {
    this.logger.debug('deletar-restaurante'+JSON.stringify(payload));
    try {
      const restaurante = await this.restauranteService.deletarRestaurantePorID(payload.restauranteID);
      if (!restaurante) {
        throw new RpcException(
          'Restaurante não encontrado'
        );
      }
      return restaurante;
    } catch (error) {
      throw new RpcException('Restaurante não encontrado!')
    }

  }

  @MessagePattern('criar-produto') /* request/reply */
  async criarProduto(
    @Payload() payload
  ) {
    this.logger.debug('criar-produto payload'+JSON.stringify(payload));
    try 
    {
      const criarProduto = {
        ...payload.produtoDTO,
        restauranteID: payload.restauranteID,
      };
      this.logger.debug('criar-produto criarProduto '+JSON.stringify(criarProduto));

      return this.produtosService.criarProduto(criarProduto);
    }
    catch (error) {
      throw new RpcException(error)
    } 
  }

  @MessagePattern('buscar-produtos') /* request/reply */
  async buscarProdutos(
    @Payload() payload,
  ): Promise<Produto[]> {
    if (payload.produtoID) {
      return this.produtosService.buscarProdutosDoRestaurante(
        payload.restauranteID,
        payload.produtoID,
      );
    }
    return this.produtosService.buscarProdutosDoRestaurante(payload.restauranteID);
  }

  @MessagePattern('deletar-produto') 
  async deletarProdutoDoRestaurante(@Payload() payload : any) {
    return this.produtosService.deletarProdutodoRestaurante(
      payload.restauranteID,
      payload.produtoID,
    );
  }
}
