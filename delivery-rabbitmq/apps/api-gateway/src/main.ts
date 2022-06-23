import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
 // app.useGlobalPipes(new ValidationPipe());
  
  const config = new DocumentBuilder()
    .setTitle('Delivery API')
    .setDescription('Demonstração API RESTFUL')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      bearerFormat: ''
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
 
  const logger = new Logger(bootstrap.name);
  await app.listen(3030); 

 
}
bootstrap();
