import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    logging: process.env.NODE_ENV !== 'production',
    migrationsRun: false,
    migrations: ['dist/src/database/migrations/*.js'],
    synchronize: false,
  }),
);
