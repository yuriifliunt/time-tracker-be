import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project/project.module';
import { TimeManagementModule } from './time-management/time-management.module';
import { TimeManagement } from './time-management/entities/time-management.entity';
import { Project } from './project/entities/project.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      entities: [TimeManagement, Project],
      synchronize: true,
    }),
    ProjectModule,
    TimeManagementModule,
  ],
})
export class AppModule {}
