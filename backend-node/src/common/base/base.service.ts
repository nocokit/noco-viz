import { NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';

/**
 * 基础服务类
 * 提供通用的 CRUD 操作，减少重复代码
 */
export abstract class BaseService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  /**
   * 查询所有记录
   * @param options 查询选项
   */
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  /**
   * 根据ID查询单条记录
   * @param id 记录ID
   * @param relations 关联关系
   */
  async findOne(id: number, relations?: string[]): Promise<T> {
    const options: any = { where: { id: id as any } as FindOptionsWhere<T> };
    if (relations && relations.length > 0) {
      options.relations = relations;
    }

    const entity = await this.repository.findOne(options);

    if (!entity) {
      throw new NotFoundException(`记录 #${id} 不存在`);
    }

    return entity;
  }

  /**
   * 根据条件查询单条记录
   * @param where 查询条件
   * @param relations 关联关系
   */
  async findOneBy(
    where: FindOptionsWhere<T>,
    relations?: string[],
  ): Promise<T | null> {
    const options: any = { where };
    if (relations && relations.length > 0) {
      options.relations = relations;
    }

    return this.repository.findOne(options);
  }

  /**
   * 创建记录
   * @param createDto 创建数据
   */
  async create(createDto: any): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity) as any;
  }

  /**
   * 更新记录
   * @param id 记录ID
   * @param updateDto 更新数据
   */
  async update(id: number, updateDto: any): Promise<T> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return this.repository.save(entity);
  }

  /**
   * 删除记录
   * @param id 记录ID
   */
  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }

  /**
   * 批量删除记录
   * @param ids 记录ID数组
   */
  async removeMany(ids: number[]): Promise<void> {
    await this.repository.delete(ids);
  }

  /**
   * 统计记录数量
   * @param where 查询条件
   */
  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repository.count({ where });
  }

  /**
   * 检查记录是否存在
   * @param id 记录ID
   */
  async exists(id: number): Promise<boolean> {
    const count = await this.repository.count({
      where: { id: id as any } as FindOptionsWhere<T>,
    });
    return count > 0;
  }

  /**
   * 通用批量操作方法
   * @param ids 记录ID数组
   * @param operation 操作函数
   * @param operationName 操作名称(用于错误消息)
   * @returns 批量操作结果
   */
  async batchOperation(
    ids: number[],
    operation: (id: number) => Promise<void>,
    operationName: string = '操作',
  ): Promise<{
    successCount: number;
    failureCount: number;
    failures: Array<{ id: number; error: string }>;
  }> {
    const results = {
      successCount: 0,
      failureCount: 0,
      failures: [] as Array<{ id: number; error: string }>,
    };

    for (const id of ids) {
      try {
        await operation(id);
        results.successCount++;
      } catch (error) {
        results.failureCount++;
        results.failures.push({
          id,
          error: error.message || `${operationName}失败`,
        });
      }
    }

    return results;
  }

  /**
   * 批量删除(带详细结果)
   * @param ids 记录ID数组
   */
  async batchDelete(ids: number[]): Promise<{
    successCount: number;
    failureCount: number;
    failures: Array<{ id: number; error: string }>;
  }> {
    return this.batchOperation(ids, (id) => this.remove(id), '删除');
  }

  /**
   * 批量更新状态
   * @param ids 记录ID数组
   * @param status 状态值
   * @param statusField 状态字段名(默认为'status')
   */
  async batchUpdateStatus(
    ids: number[],
    status: any,
    statusField: string = 'status',
  ): Promise<{
    successCount: number;
    failureCount: number;
    failures: Array<{ id: number; error: string }>;
  }> {
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

  /**
   * 批量更新字段
   * @param ids 记录ID数组
   * @param updates 更新的字段和值
   */
  async batchUpdate(
    ids: number[],
    updates: Partial<T>,
  ): Promise<{
    successCount: number;
    failureCount: number;
    failures: Array<{ id: number; error: string }>;
  }> {
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
