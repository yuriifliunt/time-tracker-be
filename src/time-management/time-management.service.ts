import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeManagement } from './entities/time-management.entity';
import { ProjectService } from '../project/project.service';
import { ProjectStatus } from '../project/entities/project.entity';

@Injectable()
export class TimeManagementService {
  constructor(
    @InjectRepository(TimeManagement)
    private readonly timeManagementRepository: Repository<TimeManagement>,
    private readonly projectService: ProjectService,
  ) {}

  async startTracking({
    projectId,
  }: {
    projectId: number;
  }): Promise<TimeManagement> {
    const project = await this.projectService.findOne(projectId);
    if (!project) throw new NotFoundException('Project not found');

    if (project.status === ProjectStatus.COMPLETED) {
      throw new BadRequestException(
        'Cannot track time for a completed project',
      );
    }

    if (project.status !== ProjectStatus.IN_PROGRESS) {
      project.status = ProjectStatus.IN_PROGRESS;
      await this.projectService.update(projectId, {
        status: ProjectStatus.IN_PROGRESS,
      });
    }

    const existingEntry = await this.timeManagementRepository.findOne({
      where: { project: { id: projectId }, endTime: null },
    });

    if (existingEntry) {
      throw new BadRequestException(
        'Tracking is already started for this project',
      );
    }

    const newEntry = this.timeManagementRepository.create({
      startTime: new Date(),
      project,
    });

    return this.timeManagementRepository.save(newEntry);
  }

  async stopTracking({
    projectId,
  }: {
    projectId: number;
  }): Promise<TimeManagement> {
    const project = await this.projectService.findOne(projectId);
    if (!project) throw new NotFoundException('Project not found');

    if (project.status !== ProjectStatus.IN_PROGRESS) {
      throw new BadRequestException('Project is not in progress');
    }

    const activeEntry = await this.timeManagementRepository.findOne({
      where: { project: { id: projectId }, endTime: null },
    });

    if (!activeEntry) {
      throw new BadRequestException(
        'No active tracking found for this project',
      );
    }

    activeEntry.endTime = new Date();

    return this.timeManagementRepository.save(activeEntry);
  }

  async findAll(): Promise<TimeManagement[]> {
    return this.timeManagementRepository.find({ relations: ['project'] });
  }

  async findOne(id: number): Promise<TimeManagement> {
    const entry = await this.timeManagementRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!entry)
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    return entry;
  }

  async remove(id: number): Promise<void> {
    await this.timeManagementRepository.delete(id);
  }
}
