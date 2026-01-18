import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IpWhitelist } from './entities/ip-whitelist.entity';
import { CreateIpWhitelistDto } from './dto/create-ip-whitelist.dto';
import { UpdateIpWhitelistDto } from './dto/update-ip-whitelist.dto';

@Injectable()
export class IpWhitelistService {
  constructor(
    @InjectRepository(IpWhitelist)
    private readonly ipWhitelistRepository: Repository<IpWhitelist>,
  ) {}

  async create(createDto: CreateIpWhitelistDto, username: string) {
    const type = createDto.ip.includes('/') ? 'cidr' : 'single';

    const ipWhitelist = this.ipWhitelistRepository.create({
      ...createDto,
      type,
      addedBy: username,
    });

    return await this.ipWhitelistRepository.save(ipWhitelist);
  }

  async findAll() {
    return await this.ipWhitelistRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const ipWhitelist = await this.ipWhitelistRepository.findOne({
      where: { id },
    });

    if (!ipWhitelist) {
      throw new NotFoundException(`IP白名单规则 #${id} 不存在`);
    }

    return ipWhitelist;
  }

  async update(id: number, updateDto: UpdateIpWhitelistDto) {
    const ipWhitelist = await this.findOne(id);

    if (updateDto.ip) {
      updateDto['type'] = updateDto.ip.includes('/') ? 'cidr' : 'single';
    }

    Object.assign(ipWhitelist, updateDto);
    return await this.ipWhitelistRepository.save(ipWhitelist);
  }

  async remove(id: number) {
    const ipWhitelist = await this.findOne(id);
    await this.ipWhitelistRepository.remove(ipWhitelist);
    return { message: '删除成功' };
  }

  async getWhitelistStatus() {
    // 这里可以从配置表或环境变量读取
    // 暂时返回硬编码值
    return {
      enabled: true,
      currentIp: '192.168.1.105', // 实际应该从请求中获取
    };
  }

  async updateWhitelistStatus(enabled: boolean) {
    // 这里应该更新配置表或环境变量
    // 暂时返回成功
    return {
      enabled,
      message: '白名单状态更新成功',
    };
  }
}
