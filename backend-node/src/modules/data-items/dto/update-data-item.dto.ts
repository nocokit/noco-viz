import { PartialType } from '@nestjs/mapped-types';
import { CreateDataItemDto } from './create-data-item.dto';

export class UpdateDataItemDto extends PartialType(CreateDataItemDto) {}
