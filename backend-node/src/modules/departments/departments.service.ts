import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/base/base.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService extends BaseService<Department> {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {
    super(departmentRepository);
  }

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
    return super.findOne(id, ['children', 'parent']);
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

  async getTree(): Promise<Department[]> {
    // 获取部门树
    const tree = await this.departmentRepository.manager.getTreeRepository(Department).findTrees();

    // 统计每个部门的用户数量
    const userCounts = await this.departmentRepository.query(`
      SELECT department_id, COUNT(*) as count
      FROM users
      WHERE department_id IS NOT NULL
      GROUP BY department_id
    `);

    // 创建部门ID到用户数量的映射
    const countMap = new Map<number, number>();
    userCounts.forEach((item: any) => {
      countMap.set(item.department_id, parseInt(item.count));
    });

    // 递归更新部门树中的count字段
    const updateCounts = (departments: Department[]) => {
      departments.forEach(dept => {
        dept.count = countMap.get(dept.id) || 0;
        if (dept.children && dept.children.length > 0) {
          updateCounts(dept.children);
        }
      });
    };

    updateCounts(tree);
    return tree;
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
