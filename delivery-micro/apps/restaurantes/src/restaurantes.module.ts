import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/comum';

import { RestaurantesController } from './restaurantes.controller';
import { RestaurantesService } from './restaurantes.service';
import { RestaurantesRepository } from './repository/restaurantes.repository';
import { Restaurante, RestauranteSchema } from './schema/restaurante.schema';
import { Produto, ProdutoSchema } from './schema/produto.schema';
import { ProdutosService } from './produtos.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/restaurantes/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Restaurante.name, schema: RestauranteSchema },
      { name: Produto.name, schema: ProdutoSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_KEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [RestaurantesController],
  providers: [
    RestaurantesService,
    ProdutosService,
    RestaurantesRepository,
    JwtStrategy,
  ],
})
export class RestaurantesModule {}
