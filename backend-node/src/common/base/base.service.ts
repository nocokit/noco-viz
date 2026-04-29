import { NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';

export abstract class BaseService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOne(id: number, relations?: string[]): Promise<T> {
    const options: any = { where: { id: id as any } as FindOptionsWhere<T> };
    if (relations?.length) {
      options.relations = relations;
    }

    const entity = await this.repository.findOne(options);
    if (!entity) {
      throw new NotFoundException(`记录 #${id} 不存在`);
    }
    return entity;
  }

  async findOneBy(where: FindOptionsWhere<T>, relations?: string[]): Promise<T | null> {
    const options: any = { where };
    if (relations?.length) {
      options.relations = relations;
    }
    return this.repository.findOne(options);
  }

  async create(createDto: any): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity) as any;
  }

  async update(id: number, updateDto: any): Promise<T> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return this.repository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }

  async removeMany(ids: number[]): Promise<void> {
    await this.repository.delete(ids);
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repository.count({ where });
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.repository.count({
      where: { id: id as any } as FindOptionsWhere<T>,
    });
    return count > 0;
  }

  async batchOperation(
    ids: number[],
    operation: (id: number) => Promise<void>,
    operationName: string = '操作',
  ): Promise<{ successCount: number; failureCount: number; failures: Array<{ id: number; error: string }> }> {
    const results = { successCount: 0, failureCount: 0, failures: [] as Array<{ id: number; error: string }> };

    for (const id of ids) {
      try {
        await operation(id);
        results.successCount++;
      } catch (error) {
        results.failureCount++;
        results.failures.push({ id, error: error.message || `${operationName}失败` });
      }
    }

    return results;
  }

  async batchDelete(ids: number[]) {
    return this.batchOperation(ids, (id) => this.remove(id), '删除');
  }

  async batchUpdateStatus(ids: number[], status: any, statusField: string = 'status') {
    return this.batchOperation(
      ids,
      async (id) => {
        const entity = await this.findOne(id);
        (entity as any)[statusField] = status;
        await this.repository.save(entity);
      },
      '更新状态',
    );
  }

  async batchUpdate(ids: number[], updates: Partial<T>) {
    return this.batchOperation(
      ids,
      async (id) => {
        const entity = await this.findOne(id);
        Object.assign(entity, updates);
        await this.repository.save(entity);
      },
      '批量更新',
    );
  }
}
