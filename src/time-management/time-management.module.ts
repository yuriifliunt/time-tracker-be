import { Module } from '@nestjs/common';
import { TimeManagementService } from './time-management.service';
import { TimeManagementController } from './time-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeManagement } from './entities/time-management.entity';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([TimeManagement]), ProjectModule],
  controllers: [TimeManagementController],
  providers: [TimeManagementService],
  exports: [TimeManagementService],
})
export class TimeManagementModule {}
