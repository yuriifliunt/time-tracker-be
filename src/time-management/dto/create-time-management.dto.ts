import { IsDateString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateTimeManagementDto {
  @IsNotEmpty()
  @IsInt()
  project: number;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;
}
