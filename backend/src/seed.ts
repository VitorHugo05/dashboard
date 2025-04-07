import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { SeedService } from './seed/seed.service';
import { SeedModule } from './seed/seed.module';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(SeedModule);
    const seedService = app.get(SeedService);
    await seedService.cleanDatabase();
    try {
        await seedService.seed(5, 10, 10);
        await app.close();
        process.exit(0);
    } catch (error) {
        console.error('Erro ao executar seed:', error);
        process.exit(1);
    }
}

bootstrap();
