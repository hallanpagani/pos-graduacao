import {
  Body,
  Controller,
  HttpCode,
  UseGuards,
  Get,
  Put,
  Post,
  Param,
  Delete,
  Patch,
  //HttpStatus,
  //HttpException,
} from '@nestjs/common';
import { RestaurantesService } from './restaurantes.service';
import { ProdutosService } from 'src/restaurantes/produtos.service';
import { ManagerGuard } from 'src/guards/manager.guard';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { UsuarioDecorator } from 'src/helpers/usuario.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CriarRestauranteDTO } from './dto/criar-restaurante.dto';
import { Restaurante } from './schema/restaurante.schema';
import { CriarRestauranteProdutoDTO } from 'src/restaurantes/dto/criar-produtos.dto';
import { AtualizarRestauranteDTO } from './dto/atualizar-restaurante.dto';
import { Usuario } from 'src/auth/schema/usuario.schema';
import { Produto } from 'src/restaurantes/schema/produto.schema';

@Controller('restaurantes')
@ApiTags('Restaurantes')
export class RestaurantesController {
  /*
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  @ApiBadRequestResponse({ description: 'Campos inválidos' })
  @ApiOperation({ summary: 'Criar um Restaurante para um Dono' })
  @ApiCreatedResponse({ description: 'Restaurante adicionado' }) 
  */
  constructor(
    private readonly restauranteService: RestaurantesService,
    private readonly produtosService: ProdutosService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), ManagerGuard)
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

  @Patch(':id')
  @UseGuards(AuthGuard('jwt') /*, ManagerGuard */)
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
  @UseGuards(AuthGuard('jwt') /*, ManagerGuard */)
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
  @UseGuards(AuthGuard('jwt')/*, ManagerGuard */)
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
  ): Promise<Produto[]> {
    return this.produtosService.buscarProdutosDoRestaurante(restauranteID);
  }
  
  @Get(':id/produtos/:produto')
  @UseGuards(AuthGuard('jwt') /*, ManagerGuard */ )
  @ApiBearerAuth()
  async buscarProduto(
    @Param('id') restauranteID: string,
    @Param('produto') produto: string,
  ): Promise<Produto[]> {
    return this.produtosService.buscarProdutosDoRestaurante(
      restauranteID,
      produto,
    );
  }

  @Delete(':id/produtos/:produto')
  @UseGuards(AuthGuard('jwt')/*, ManagerGuard */)
  @ApiBearerAuth()
  async deletarProdutoDoRestaurante(
    @Param('id') restauranteID: string,
    @Param('produto') produtoID: string,
    @UsuarioDecorator() user: Usuario
  ) {
    return this.produtosService.deletarProdutodoRestaurante(restauranteID, produtoID);
  }
}
