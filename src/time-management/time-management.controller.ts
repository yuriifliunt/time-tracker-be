import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { TimeManagementService } from './time-management.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('time-management')
export class TimeManagementController {
  constructor(private readonly timeManagementService: TimeManagementService) {}

  @Post(':id')
  @ApiOperation({ summary: 'Start Tracking time for a project' })
  @ApiParam({ name: 'id', required: true, description: 'Project Id' })
  create(@Param('id') id: string) {
    return this.timeManagementService.startTracking({ id });
  }

  @Get(':projectId')
  @ApiOperation({ summary: 'Find all time trackers related to a project' })
  @ApiParam({ name: 'projectId', required: true, description: 'Project Id' })
  findAll(@Param('projectId') projectId: string) {
    return this.timeManagementService.findAll({ projectId: Number(projectId) });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find single time tracker' })
  @ApiParam({ name: 'id', required: true, description: 'Time Tracker Id' })
  findOne(@Param('id') id: string) {
    return this.timeManagementService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Stop Tracking time for a project' })
  @ApiParam({ name: 'id', required: true, description: 'Project Id' })
  update(@Param('id') id: string) {
    return this.timeManagementService.stopTracking({ projectId: Number(id) });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete time tracker for a project' })
  @ApiParam({ name: 'id', required: true, description: 'Time Tracker Id' })
  remove(@Param('id') id: string) {
    return this.timeManagementService.remove(+id);
  }
}
