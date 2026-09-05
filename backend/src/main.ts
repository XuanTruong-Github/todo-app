import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  app.use(compression());
  app.enableCors();
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription(
      'Auth docs at <a href="/api/auth/reference" target="_blank">/api/auth/reference</a>',
    )
    .setVersion('1.0')
    .addTag('todos')

    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') ?? 8080;
  await app.listen(port, async () => {
    console.log(`Application is running on: http://localhost:${port}/api`);
    console.log(`API DOCS: http://localhost:${port}/api/docs`);
  });
}
bootstrap().catch((error) => {
  console.error('Application failed to start', error);
  process.exit(1);
});
