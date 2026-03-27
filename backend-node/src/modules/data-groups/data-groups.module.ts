import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataGroupsService } from './data-groups.service';
import { DataGroupsController } from './data-groups.controller';
import { DataGroup } from './entities/data-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DataGroup])],
  controllers: [DataGroupsController],
  providers: [DataGroupsService],
  exports: [DataGroupsService],
})
export class DataGroupsModule {}
