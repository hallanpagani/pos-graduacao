import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiPayloadTooLargeResponse, ApiTags } from '@nestjs/swagger';
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

@Controller('restaurantes')
@ApiTags('Restaurantes')
export class RestaurantesController {
  constructor(
    private readonly restauranteService: RestaurantesService,
    private readonly produtosService: ProdutosService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async criarRestaurante(
    @Body() restauranteDTO: CriarRestauranteDTO,
    @UsuarioDecorator() user: Usuario,
  ): Promise<Restaurante> {
    return this.restauranteService.criarRestaurante(restauranteDTO, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async buscarTodosRestaurantes(@UsuarioDecorator() user: Usuario) {
    return this.restauranteService.buscarRestaurantes(user);
  }

  @Put(':id')
  // @UseGuards(AuthGuard('jwt') /*, DonoGuard */)
  @ApiBearerAuth()
  async atualizarRestaurante(
    @UsuarioDecorator() user: Usuario,
    @Param('id') restauranteID: string,
    @Body() restauranteDTO: AtualizarRestauranteDTO,
  ): Promise<Restaurante> {
    return this.restauranteService.atualizarRestaurante(
      restauranteID,
      restauranteDTO,
    );
  }

  @Delete(':id')
  //@UseGuards(AuthGuard('jwt'), DonoGuard)
  @ApiBearerAuth()
  async deletarRestaurante(
    @UsuarioDecorator() user: Usuario,
    @Param('id') restauranteID: string,
  ) {
    return this.restauranteService.deletarRestaurantePorID(restauranteID);
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async buscarRestaurante(
    @UsuarioDecorator() user: Usuario,
    @Param('id') restauranteID: string,
  ) {
    return await this.restauranteService.buscarRestaurantePorId(restauranteID);
  }

  @Post(':id/produtos')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt') /*DonoGuard*/)
  @ApiBearerAuth()
  async criarProduto(
    @Body() produtoDTO: CriarRestauranteProdutoDTO,
    @Param('id') restauranteID: string,
    //@UsuarioDecorator() user: Usuario,
  ) {
    return this.produtosService.criarProduto(restauranteID, produtoDTO);
  }

  @Get(':id/produtos')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async buscarProdutos(
    @Param('id') restauranteID: string,
    //@UsuarioDecorator() user: Usuario,
  ): Promise<Produto[]> {
    return this.produtosService.buscarProdutosDoRestaurante(restauranteID);
  }

  @Get(':id/produtos/:produto')
  //@UseGuards(AuthGuard('jwt'), DonoGuard)
  @ApiBearerAuth()
  async buscarProduto(
    @Param('id') restauranteID: string,
    @Param('produto') produto: string,
    //@UsuarioDecorator() user: Usuario,
  ): Promise<Produto[]> {
    return this.produtosService.buscarProdutosDoRestaurante(
      restauranteID,
      produto,
    );
  }

  @Delete(':id/produtos/:produto')
  //@UseGuards(AuthGuard('jwt'), DonoGuard)
  @ApiBearerAuth()
  async deletarProdutoDoRestaurante(
    @Param('id') restauranteID: string,
    @Param('produto') produtoID: string,
    @UsuarioDecorator() user: Usuario,
  ) {
    return this.produtosService.deletarProdutodoRestaurante(
      restauranteID,
      produtoID,
    );
  }
}
