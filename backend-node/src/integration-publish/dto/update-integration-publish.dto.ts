import { PartialType } from '@nestjs/swagger';
import { CreateIntegrationPublishDto } from './create-integration-publish.dto';

export class UpdateIntegrationPublishDto extends PartialType(
  CreateIntegrationPublishDto,
) {}
