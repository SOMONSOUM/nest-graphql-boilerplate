import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
});

const configService = new ConfigService();
const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  url: configService.get('DATABASE_URL'),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/src/database/migrations/*.js'],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  synchronize: false,
};

export default databaseConfig;
