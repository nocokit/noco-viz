import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RecycleBin } from './recycle.entity';

@Injectable()
export class RecycleService {
  constructor(
    @InjectRepository(RecycleBin)
    private recycleRepository: Repository<RecycleBin>,
  ) {}

  async getRecycleList(type?: string) {
    const where = type ? { type } : {};
    const items = await this.recycleRepository.find({
      where,
      relations: ['deletedBy'],
      order: { deletedAt: 'DESC' },
    });

    return items.map(item => ({
      id: item.id,
      name: item.name,
      location: item.location,
      type: item.type,
      deletedBy: item.deletedBy?.username || 'Unknown',
      deletedById: item.deletedBy?.id || null,
      deletedAt: item.deletedAt,
      daysLeft: this.calculateDaysLeft(item.deletedAt, item.autoDeleteAt),
      iconStyle: this.getIconStyle(item.type),
    }));
  }

  async getRecycleStats() {
    const [project, datasource, media, component] = await Promise.all([
      this.recycleRepository.count({ where: { type: 'project' } }),
      this.recycleRepository.count({ where: { type: 'datasource' } }),
      this.recycleRepository.count({ where: { type: 'media' } }),
      this.recycleRepository.count({ where: { type: 'component' } }),
    ]);

    return {
      project,
      datasource,
      media,
      component,
      total: project + datasource + media + component,
    };
  }

  async restoreItem(id: number) {
    const item = await this.recycleRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('项目不存在');
    }

    // 这里应该恢复原始数据到对应的表
    // 根据 item.type 和 item.originalData 恢复数据

    await this.recycleRepository.delete(id);

    return {
      success: true,
      message: '项目已成功还原',
      item: {
        id: item.id,
        name: item.name,
        type: item.type,
      },
    };
  }

  async batchRestore(ids: number[]) {
    const items = await this.recycleRepository.find({
      where: { id: In(ids) },
    });

    if (items.length === 0) {
      throw new NotFoundException('未找到要还原的项目');
    }

    // 批量恢复
    for (const item of items) {
      await this.restoreItem(item.id);
    }

    return {
      success: true,
      message: `已成功还原 ${items.length} 个项目`,
      count: items.length,
    };
  }

  async deleteItem(id: number) {
    const item = await this.recycleRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('项目不存在');
    }

    await this.recycleRepository.delete(id);

    return {
      success: true,
      message: '项目已彻底删除',
    };
  }

  async batchDelete(ids: number[]) {
    const result = await this.recycleRepository.delete({ id: In(ids) });

    return {
      success: true,
      message: `已彻底删除 ${result.affected} 个项目`,
      count: result.affected,
    };
  }

  async emptyRecycleBin(type?: string) {
    const where = type ? { type } : {};
    const result = await this.recycleRepository.delete(where);

    return {
      success: true,
      message: type
        ? `已清空 ${type} 类型的回收站`
        : '回收站已清空',
      count: result.affected,
    };
  }

  private calculateDaysLeft(deletedAt: Date, autoDeleteAt: Date): number {
    if (autoDeleteAt) {
      const now = new Date();
      const diff = autoDeleteAt.getTime() - now.getTime();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    // 默认30天后删除
    const now = new Date();
    const deleteDate = new Date(deletedAt);
    deleteDate.setDate(deleteDate.getDate() + 30);
    const diff = deleteDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  private getIconStyle(type: string): string {
    const styles = {
      project: 'background: linear-gradient(135deg, #3b82f6, #06b6d4); color:#fff',
      datasource: 'background: linear-gradient(135deg, #10b981, #059669); color:#fff',
      media: 'background: linear-gradient(135deg, #f59e0b, #d97706); color:#fff',
      component: 'background: linear-gradient(135deg, #8b5cf6, #7c3aed); color:#fff',
    };
    return styles[type] || 'background:#333';
  }
}
