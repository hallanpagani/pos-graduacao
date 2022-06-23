import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { RestaurantesModule } from 'src/restaurantes/restaurantes.module';
import { Pedido, PedidoSchema } from './schema/pedidos.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pedido.name, schema: PedidoSchema }]),
    AuthModule,
    RestaurantesModule,
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {} 
