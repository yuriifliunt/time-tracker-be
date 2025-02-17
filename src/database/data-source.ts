import { DataSource } from 'typeorm';
import { Project } from '../project/entities/project.entity';
import { TimeManagement } from '../time-management/entities/time-management.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: [TimeManagement, Project],
  synchronize: true,
  migrations: ['src/database/migrations/*.ts'],
});
