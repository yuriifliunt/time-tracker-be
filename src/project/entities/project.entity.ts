import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TimeManagement } from '../../time-management/entities/time-management.entity';

export enum ProjectStatus {
  CREATED = 'created',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.CREATED,
  })
  status: ProjectStatus;

  @OneToMany(() => TimeManagement, (time) => time.project)
  timeEntries: TimeManagement[];
}
