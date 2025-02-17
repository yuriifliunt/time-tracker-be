import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeManagementDto } from './create-time-management.dto';

export class UpdateTimeManagementDto extends PartialType(
  CreateTimeManagementDto,
) {}
