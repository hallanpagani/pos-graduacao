import { Usuario, UsuarioDecorator } from '@app/comum';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Restaurante } from 'apps/restaurantes/src/schema/restaurante.schema';
import { firstValueFrom } from 'rxjs';
import { SERVICO_AUTH } from '../auth/contantes/servico';
import { SERVICO_RESTAURANTE } from './contantes/servico';
import { AtualizarRestauranteDTO } from './dto/atualizar-restaurante-dto';
import { CriarRestauranteDTO } from './dto/create-restaurante-dto';
import { CriarRestauranteProdutoDTO } from './dto/criar-produtos.dto';

@Controller('restaurantes')
export class RestaurantesController {
  private logger = new Logger(RestaurantesController.name);

  /*private clientApiRestauranteGateway: ClientProxy;
  this.clientApiRestauranteGateway = ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: [
        '',
      ],
      queue: 'micro-restaurante',
    },
  });*/ 

  constructor(@Inject(SERVICO_RESTAURANTE) private clientRestaurante: ClientProxy) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async criarRestaurante(
    @Body() criarRestante,
    @UsuarioDecorator() usuario: Usuario,
  ) {
    try {
      this.logger.debug('criarRestante'+JSON.stringify(criarRestante));
      this.logger.log(criarRestante);   
      return this.clientRestaurante.send('criar-restaurante', criarRestante);
    } catch (error) {
       throw new HttpException(error, HttpStatus.CONFLICT)
    }


  }

  @Get(':id?')
  @UseGuards(AuthGuard('jwt'))
  async buscarRestaurantes(
    @UsuarioDecorator() usuario: Usuario,
    @Param('id') restauranteID: string,
  ) {
    this.logger.log(restauranteID);
    const restaurantes = await firstValueFrom( this.clientRestaurante.send('buscar-restaurantes', {
      restauranteID,
      usuario,
    })); 
    //this.logger.log(restaurantes);
    if (!restaurantes) {
      throw new HttpException('Restaurante não encontrado!', HttpStatus.NOT_FOUND)
    }
    return restaurantes;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async atualizarRestaurante(
    @Body() atualizarRestante: AtualizarRestauranteDTO,
    @UsuarioDecorator() usuario: Usuario,
    @Param('id') restauranteID: string,
  ) {
    this.logger.debug('atualizar-restaurante'+JSON.stringify(atualizarRestante));
    this.logger.log(restauranteID);
    const restaurante = await firstValueFrom(
        await this.clientRestaurante.send('atualizar-restaurante', {restauranteID, atualizarRestante} ));
    if (!restaurante) {
      throw new HttpException('Restaurante não encontrado!', HttpStatus.NOT_FOUND)
    }            
    return restaurante;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deletarRestaurante(
    @UsuarioDecorator() usuario: Usuario,
    @Param('id') restauranteID: string,
  ) {
    try {
      this.logger.debug('deletar-restaurante'+JSON.stringify(restauranteID));
      return await firstValueFrom( this.clientRestaurante.send('deletar-restaurante', { usuario, restauranteID} ));
    } catch (error) {
      this.logger.debug(error.message);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }


  @Post(':id/produtos')
  @UseGuards(AuthGuard('jwt') /*, ManagerGuard */)
  @ApiBearerAuth()
  async criarProduto(
    @Body() produtoDTO: CriarRestauranteProdutoDTO,
    @Param('id') restauranteID: string,
    //@UsuarioDecorator() user: Usuario,
  ) {
    try {
      this.logger.debug('deletar-restaurante'+JSON.stringify(restauranteID));
      return await firstValueFrom(this.clientRestaurante.send('criar-produto', { restauranteID, produtoDTO}));
    } catch (error) {
      this.logger.debug(error.message);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }

  }

  @Get(':id/produtos')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async buscarProdutos(
    @Param('id') restauranteID: string,
    @UsuarioDecorator() user: Usuario,
  ) {
    return this.clientRestaurante.send('buscar-produtos',{ user, restauranteID } );
  }

  @Get(':id/produtos/:produto')
  @UseGuards(AuthGuard('jwt') /*, ManagerGuard */)
  @ApiBearerAuth()
  async buscarProduto(
    @Param('id') restauranteID: string,
    @Param('produto') produtoID: string,
    @UsuarioDecorator() user: Usuario,
  ) {
    return this.clientRestaurante.send('buscar-produtos',{ user, restauranteID, produtoID} );
  }

  @Delete(':id/produtos/:produto')
  @UseGuards(AuthGuard('jwt') /*, ManagerGuard */)
  @ApiBearerAuth()
  async deletarProdutoDoRestaurante(
    @Param('id') restauranteID: string,
    @Param('produto') produtoID: string,
    @UsuarioDecorator() user: Usuario
  ) {
    return this.clientRestaurante.send('deletar-produto',{ user, restauranteID, produtoID} );
  }

}
