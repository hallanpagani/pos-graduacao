import { RmqService } from '@app/comum';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { PedidosModule } from './pedidos.module';

async function bootstrap() {
  const app = await NestFactory.create(PedidosModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('PEDIDOS'));
  await app.startAllMicroservices();
}
bootstrap();
