import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cors from 'cors';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use(compression());
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
