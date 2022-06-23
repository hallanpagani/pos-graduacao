import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule } from '@app/comum';
import { RestaurantesController } from './restaurantes.controller';
import { JwtStrategy } from '../../../../libs/comum/src/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { SERVICO_RESTAURANTE } from './contantes/servico';

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
    RmqModule.register({
      name : SERVICO_RESTAURANTE,
    }),
    DatabaseModule,
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
    JwtStrategy,
  ],
})
export class RestaurantesModule {}
