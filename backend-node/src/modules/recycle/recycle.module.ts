import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecycleController } from './recycle.controller';
import { RecycleService } from './recycle.service';
import { RecycleBin } from './recycle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecycleBin])],
  controllers: [RecycleController],
  providers: [RecycleService],
  exports: [RecycleService],
})
export class RecycleModule {}
