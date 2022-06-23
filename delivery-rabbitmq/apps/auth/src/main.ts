import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/comum';
import { AuthModule } from './auth.module';
import { SERVICO_AUTH } from './contantes/servicos';


async function bootstrap() {

  const app = await NestFactory.create(AuthModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(SERVICO_AUTH));
  await app.startAllMicroservices();
}
bootstrap();
