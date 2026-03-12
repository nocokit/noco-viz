import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationPublishService } from './integration-publish.service';
import { IntegrationPublishController } from './integration-publish.controller';
import { IntegrationPublish } from './entities/integration-publish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IntegrationPublish])],
  controllers: [IntegrationPublishController],
  providers: [IntegrationPublishService],
  exports: [IntegrationPublishService],
})
export class IntegrationPublishModule {}
