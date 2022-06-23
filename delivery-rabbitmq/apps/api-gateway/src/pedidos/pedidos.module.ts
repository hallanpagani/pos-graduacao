import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule } from '@app/comum';
import { PedidosController } from './pedidos.controller';
import { JwtStrategy } from '@app/comum';
import { JwtModule } from '@nestjs/jwt';
import { SERVICO_PEDIDOS } from './constante/servico';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/pedidos/.env',
    }), 
    RmqModule.register({
      name : SERVICO_PEDIDOS,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_KEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PedidosController],
  providers: [JwtStrategy],
})
export class PedidosModule {}
