import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@app/comum';
import { RestaurantesController } from './restaurantes/restaurantes.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { RmqModule } from '@app/comum';
import { SERVICO_AUTH } from './auth/contantes/servico';
import { RestaurantesModule } from './restaurantes/restaurantes.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/api-gateway/.env',
      //isGlobal : true
    }), /*
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_KEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES') },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    RmqModule.register({
      name: SERVICO_AUTH,
    }), */
    RestaurantesModule,
    PedidosModule,
    AuthModule
  ],
  controllers: [//RestaurantesController, 
                //AuthController
              ],
 // providers: [JwtStrategy],
})
export class ApiGatewayModule {}
