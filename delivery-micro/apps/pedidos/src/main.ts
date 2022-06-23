import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PedidosModule } from './pedidos.module';

async function bootstrap() {
  const app = await NestFactory.create(PedidosModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  const options = new DocumentBuilder()
    .setTitle('REST API')
    .setDescription('Documentação de PEDIDOS')
    .setVersion('1.0.0')
    //.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api', app, document);


  await app.listen(configService.get('PORT'));
}
bootstrap();
