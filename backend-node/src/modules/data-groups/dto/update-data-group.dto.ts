import { PartialType } from '@nestjs/mapped-types';
import { CreateDataGroupDto } from './create-data-group.dto';

export class UpdateDataGroupDto extends PartialType(CreateDataGroupDto) {}
