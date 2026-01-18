import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig } from './entities/system-config.entity';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class SystemConfigService {
  constructor(
    @InjectRepository(SystemConfig)
    private readonly configRepository: Repository<SystemConfig>,
  ) {}

  /**
   * 获取所有配置
   */
  async findAll(): Promise<Record<string, any>> {
    const configs = await this.configRepository.find();
    const result: Record<string, any> = {};

    configs.forEach(config => {
      try {
        // 尝试解析 JSON 值
        result[config.key] = JSON.parse(config.value);
      } catch {
        // 如果不是 JSON，直接使用字符串值
        result[config.key] = config.value;
      }
    });

    return result;
  }

  /**
   * 获取单个配置
   */
  async findOne(key: string): Promise<any> {
    const config = await this.configRepository.findOne({ where: { key } });
    if (!config) {
      return null;
    }

    try {
      return JSON.parse(config.value);
    } catch {
      return config.value;
    }
  }

  /**
   * 更新单个配置
   */
  async update(key: string, updateDto: UpdateConfigDto): Promise<SystemConfig> {
    let config = await this.configRepository.findOne({ where: { key } });

    const value = typeof updateDto.value === 'string'
      ? updateDto.value
      : JSON.stringify(updateDto.value);

    if (config) {
      config.value = value;
      if (updateDto.description) {
        config.description = updateDto.description;
      }
    } else {
      config = this.configRepository.create({
        key,
        value,
        description: updateDto.description,
      });
    }

    return this.configRepository.save(config);
  }

  /**
   * 批量更新配置
   */
  async batchUpdate(configs: Record<string, any>): Promise<{ success: boolean; updated: number }> {
    let updated = 0;

    for (const [key, value] of Object.entries(configs)) {
      await this.update(key, { value: typeof value === 'string' ? value : JSON.stringify(value) });
      updated++;
    }

    return { success: true, updated };
  }

  /**
   * 删除配置
   */
  async remove(key: string): Promise<void> {
    await this.configRepository.delete({ key });
  }
}
