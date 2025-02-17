import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

@Entity()
export class TimeManagement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @ManyToOne(() => Project, (project) => project.timeEntries, {
    onDelete: 'CASCADE',
  })
  project: Project;
}
