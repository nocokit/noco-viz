import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasourcesController } from './datasources.controller';
import { DatasourcesService } from './datasources.service';
import { Datasource } from './entities/datasource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Datasource])],
  controllers: [DatasourcesController],
  providers: [DatasourcesService],
  exports: [DatasourcesService],
})
export class DatasourcesModule {}
