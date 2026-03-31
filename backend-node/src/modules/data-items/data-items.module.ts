import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataItemsService } from './data-items.service';
import { DataItemsController } from './data-items.controller';
import { DataItem } from './entities/data-item.entity';
import { Datasource } from '../datasources/entities/datasource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DataItem, Datasource])],
  controllers: [DataItemsController],
  providers: [DataItemsService],
  exports: [DataItemsService],
})
export class DataItemsModule {}
