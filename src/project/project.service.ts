import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { calculateTotalTimeTracked } from 'src/utils/calculateTotalTimeTracked';
import { TTimeEntrie } from 'src/types/timeEntries';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      status: ProjectStatus.CREATED,
    });
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['timeEntries'] });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['timeEntries'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    project['timeEntries'] = undefined;
    project['timeTracked'] = calculateTotalTimeTracked(
      project.timeEntries as TTimeEntrie[],
    );

    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);

    if (
      updateProjectDto.status === ProjectStatus.COMPLETED &&
      project.timeEntries.length === 0
    ) {
      throw new BadRequestException(
        'Cannot mark project as completed without time entries',
      );
    }

    await this.projectRepository.update(id, updateProjectDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
