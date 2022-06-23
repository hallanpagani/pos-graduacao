import { RmqService } from '@app/comum';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RestaurantesModule } from './restaurantes.module';

  const logger = new Logger('MAIN');

async function bootstrap() {
/*app.useGlobalPipes(new ValidationPipe());
  /*const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT')); */
  /* const app = await NestFactory.createMicroservice<MicroserviceOptions>(RestaurantesModule, {
    transport: Transport.RMQ,
    options: {
      urls:['amqps://hallanpagani:hallanpagani@b-0ea8fbbf-d952-48e5-b2e7-fa975bf0cc4c.mq.us-east-1.amazonaws.com:5671/micro-delivery'],
      queue: 'micro-restaurante',
      queueOptions: {
        durable: true
      },
    },
  }); */ 

  
  const app = await NestFactory.create(RestaurantesModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('RESTAURANTES'));
  
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
  




}
bootstrap();
