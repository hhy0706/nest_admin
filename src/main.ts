import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get('nest_server_prefix'));
  // app.useGlobalPipes(new ValidationPipe());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('admin-background')
    .setDescription('api接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证',
    })
    .build();
    
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useStaticAssets('public', { prefix: '/static' });
  app.enableCors();
  console.log(`Nest-Admin 服务启动成功 `, '\n', '\n', '服务地址', `http://localhost:${configService.get('nest_server_port')}/`, '\n', 'swagger 文档地址        ', `http://localhost:${configService.get('nest_server_port')}/swagger/`);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
