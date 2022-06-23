import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RestaurantesModule } from './restaurantes.module';

async function bootstrap() {
  const app = await NestFactory.create(RestaurantesModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  const options = new DocumentBuilder()
    .setTitle('REST API')
    .setDescription('Documentação de RESTAURANTES')
    .setVersion('1.0.0')
    //.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api', app, document);

  await app.listen(configService.get('PORT'));
}
bootstrap();
