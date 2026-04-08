import databaseConfig from '@/database/database.config';
import { DataSource } from 'typeorm';
export const AppDataSource = new DataSource({
  ...databaseConfig,
  entities: ['src/modules/**/*.entity.ts'],
});
