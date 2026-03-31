import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { Logger } from './common/utils/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  // 配置静态文件服务 - 提供上传文件访问
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 启用 CORS
  app.enableCors();

  // 禁用 API 缓存
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  // 全局异常过滤器（按顺序应用）
  app.useGlobalFilters(new AllExceptionsFilter(), new GlobalExceptionFilter());

  // 全局响应转换拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API 前缀
  app.setGlobalPrefix('api');

  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('Noco-Viz API')
    .setDescription('Noco-Viz - 数据可视化平台 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', '认证授权')
    .addTag('users', '用户管理')
    .addTag('roles', '角色管理')
    .addTag('projects', '项目管理')
    .addTag('datasets', '数据集管理')
    .addTag('datasources', '数据源管理')
    .addTag('monitor', '系统监控')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
