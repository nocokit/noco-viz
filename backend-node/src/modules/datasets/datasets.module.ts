import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasetsService } from './datasets.service';
import { DatasetsController } from './datasets.controller';
import { ConnectionsController } from './connections.controller';
import { Dataset } from './entities/dataset.entity';
import { Connection } from './entities/connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dataset, Connection])],
  controllers: [DatasetsController, ConnectionsController],
  providers: [DatasetsService],
  exports: [DatasetsService],
})
export class DatasetsModule {}
