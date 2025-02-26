import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Running API in MODE : ${process.env.NODE_ENV} on Port : ${process.env.PORT} `,
    );
  });
}
bootstrap();
