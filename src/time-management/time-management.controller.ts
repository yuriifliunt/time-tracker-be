import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { TimeManagementService } from './time-management.service';
import { CreateTimeManagementDto } from './dto/create-time-management.dto';

@Controller('time-management')
export class TimeManagementController {
  constructor(private readonly timeManagementService: TimeManagementService) {}

  @Post()
  create(@Param() id: CreateTimeManagementDto) {
    return this.timeManagementService.startTracking({ projectId: Number(id) });
  }

  @Get()
  findAll() {
    return this.timeManagementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeManagementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.timeManagementService.stopTracking({ projectId: Number(id) });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeManagementService.remove(+id);
  }
}
