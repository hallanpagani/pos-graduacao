import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { RestaurantesController } from './restaurantes.controller';
import { RestaurantesService } from './restaurantes.service';
import { Restaurante, RestauranteSchema } from './schema/restaurante.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Produto, ProdutoSchema } from './schema/produto.schema';
import { ProdutosService } from './produtos.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: RestauranteSchema, name: Restaurante.name },
      { schema: ProdutoSchema, name: Produto.name },
    ]),
    AuthModule
  ],
  controllers: [RestaurantesController],
  providers: [RestaurantesService, ProdutosService],
  exports: [RestaurantesService, ProdutosService],
})
export class RestaurantesModule {}
