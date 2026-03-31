import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataGroup } from './entities/data-group.entity';
import { CreateDataGroupDto } from './dto/create-data-group.dto';
import { UpdateDataGroupDto } from './dto/update-data-group.dto';

@Injectable()
export class DataGroupsService {
  constructor(
    @InjectRepository(DataGroup)
    private dataGroupsRepository: Repository<DataGroup>,
  ) {}

  async create(createDto: CreateDataGroupDto, userId: number): Promise<DataGroup> {
    const group = this.dataGroupsRepository.create({
      ...createDto,
      createdById: userId,
    });
    return this.dataGroupsRepository.save(group);
  }

  async findAll(): Promise<DataGroup[]> {
    return this.dataGroupsRepository.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<DataGroup> {
    const group = await this.dataGroupsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!group) {
      throw new NotFoundException(`数据集 #${id} 不存在`);
    }
    return group;
  }

  async update(id: number, updateDto: UpdateDataGroupDto): Promise<DataGroup> {
    const group = await this.findOne(id);
    Object.assign(group, updateDto);
    return this.dataGroupsRepository.save(group);
  }

  async remove(id: number): Promise<void> {
    const group = await this.findOne(id);
    await this.dataGroupsRepository.remove(group);
  }
}
