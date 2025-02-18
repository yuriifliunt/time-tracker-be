import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the Project',
    example: 'My New Project',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
