import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { LoggingInterceptor } from './common/filters/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Multi-vendor example')
    .setDescription('The multi-vendor API description')
    .setVersion('3.0')
    .addTag('multi-vendor')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  // swagger console log
  console.log(
    `Swagger UI available at http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();
