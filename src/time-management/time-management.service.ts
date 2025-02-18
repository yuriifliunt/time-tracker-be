import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { TimeManagement } from './entities/time-management.entity';
import { ProjectService } from '../project/project.service';
import { ProjectStatus } from '../project/entities/project.entity';
import { isTrackingTooShort } from 'src/utils/isTrackingTooShort';

@Injectable()
export class TimeManagementService {
  constructor(
    @InjectRepository(TimeManagement)
    private readonly timeManagementRepository: Repository<TimeManagement>,
    private readonly projectService: ProjectService,
  ) {}

  async startTracking({ id }: { id: string }): Promise<TimeManagement> {
    const projectId = +id;
    const project = await this.projectService.findOne(projectId);
    if (!project) throw new NotFoundException('Project not found');

    if (project.status === ProjectStatus.COMPLETED) {
      throw new BadRequestException(
        'Cannot track time for a completed project',
      );
    }

    const existingEntry = await this.timeManagementRepository.findOne({
      where: { project: { id: projectId }, endTime: IsNull() },
    });

    if (existingEntry) {
      throw new BadRequestException(
        'Tracking is already started for this project',
      );
    }

    if (project.status !== ProjectStatus.IN_PROGRESS) {
      project.status = ProjectStatus.IN_PROGRESS;
      await this.projectService.update(projectId, {
        status: ProjectStatus.IN_PROGRESS,
      });
    }

    const newEntry = this.timeManagementRepository.create({
      startTime: new Date(),
      project,
      endTime: null,
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
      where: { project: { id: projectId }, endTime: IsNull() },
    });

    if (!activeEntry) {
      throw new BadRequestException(
        'No active tracking found for this project',
      );
    }

    if (isTrackingTooShort(activeEntry.startTime)) {
      await this.timeManagementRepository.remove(activeEntry);
      throw new BadRequestException('Tracking time is less than 15min');
    }

    activeEntry.endTime = new Date();

    return this.timeManagementRepository.save(activeEntry);
  }

  async findAll({
    projectId,
  }: {
    projectId: number;
  }): Promise<TimeManagement[]> {
    return this.timeManagementRepository.find({
      where: { project: { id: projectId } },
      relations: ['project'],
    });
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
