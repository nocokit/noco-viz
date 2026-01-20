import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create(createDepartmentDto);

    if (createDepartmentDto.parentId) {
      const parent = await this.departmentRepository.findOne({
        where: { id: createDepartmentDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent department with ID ${createDepartmentDto.parentId} not found`);
      }
      department.parent = parent;
    }

    return this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.manager.getTreeRepository(Department).findTrees();
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['children', 'parent'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);

    if (updateDepartmentDto.parentId) {
      const parent = await this.departmentRepository.findOne({
        where: { id: updateDepartmentDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent department with ID ${updateDepartmentDto.parentId} not found`);
      }
      department.parent = parent;
    }

    Object.assign(department, updateDepartmentDto);
    return this.departmentRepository.save(department);
  }

  async remove(id: number): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
  }

  async getTree(): Promise<Department[]> {
    return this.departmentRepository.manager.getTreeRepository(Department).findTrees();
  }

  async getDescendants(id: number): Promise<Department[]> {
    const department = await this.findOne(id);
    return this.departmentRepository.manager.getTreeRepository(Department).findDescendants(department);
  }

  async updateMemberCount(id: number, count: number): Promise<Department> {
    const department = await this.findOne(id);
    department.count = count;
    return this.departmentRepository.save(department);
  }
}
