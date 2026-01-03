import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS với cấu hình chi tiết cho Telegram Mini App
  app.enableCors({
    origin: [
      'https://your-frontend-domain.vercel.app',
      'https://your-bot-domain.t.me',
      'http://localhost:3000',
      'http://localhost:5173', // Vite dev server
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT || 9999;
  await app.listen(port);
  
  console.log(`🚀 Cedra Quest Backend running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
}
bootstrap();
