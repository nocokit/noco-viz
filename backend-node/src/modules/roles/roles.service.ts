import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  /**
   * 创建角色
   */
  async create(createRoleDto: CreateRoleDto) {
    // 生成 key（如果没有提供）
    const key = createRoleDto.key || createRoleDto.name.toLowerCase().replace(/\s+/g, '_');

    const existingRole = await this.rolesRepository.findOne({
      where: { key },
    });

    if (existingRole) {
      throw new ConflictException('角色标识已存在');
    }

    // 构建角色数据
    let roleData: any;
    if (createRoleDto.value) {
      // 兼容旧格式
      roleData = typeof createRoleDto.value === 'string'
        ? createRoleDto.value
        : JSON.stringify(createRoleDto.value);
    } else {
      // 新格式
      roleData = JSON.stringify({
        name: createRoleDto.name,
        description: createRoleDto.description || '',
        scope: createRoleDto.scope,
        isSystem: createRoleDto.isSystem || false,
        permissions: createRoleDto.permissions || {}
      });
    }

    const role = this.rolesRepository.create({
      key,
      value: roleData,
      description: createRoleDto.description,
    });

    return await this.rolesRepository.save(role);
  }

  /**
   * 获取所有角色
   */
  async findAll(): Promise<any[]> {
    const roles = await this.rolesRepository.find({
      relations: ['users'],
      order: { createdAt: 'DESC' },
    });

    return roles.map(role => {
      let roleData: any = {};
      try {
        roleData = JSON.parse(role.value);
      } catch {
        roleData = {};
      }

      return {
        id: role.id,
        key: role.key,
        name: roleData.name || role.key,
        description: role.description || roleData.description || '',
        scope: roleData.scope || 'self',
        isSystem: roleData.isSystem || false,
        userCount: role.users?.length || 0,
        permissions: roleData.permissions || {},
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      };
    });
  }

  /**
   * 获取单个角色（通过ID）
   */
  async findById(id: number): Promise<any> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['users']
    });

    if (!role) {
      throw new NotFoundException(`角色 ID ${id} 不存在`);
    }

    let roleData: any = {};
    try {
      roleData = JSON.parse(role.value);
    } catch {
      roleData = {};
    }

    return {
      id: role.id,
      key: role.key,
      name: roleData.name || role.key,
      description: role.description || roleData.description || '',
      scope: roleData.scope || 'self',
      isSystem: roleData.isSystem || false,
      userCount: role.users?.length || 0,
      permissions: roleData.permissions || {},
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  /**
   * 获取单个角色（通过key）
   */
  async findOne(key: string): Promise<any> {
    const role = await this.rolesRepository.findOne({ where: { key } });

    if (!role) {
      throw new NotFoundException(`角色 ${key} 不存在`);
    }

    try {
      return JSON.parse(role.value);
    } catch {
      return role.value;
    }
  }

  /**
   * 更新角色
   */
  async update(key: string, updateDto: UpdateRoleDto): Promise<Role> {
    let role = await this.rolesRepository.findOne({ where: { key } });

    // 构建角色数据
    let roleData: any;
    if (updateDto.value) {
      // 兼容旧格式
      roleData = typeof updateDto.value === 'string'
        ? updateDto.value
        : JSON.stringify(updateDto.value);
    } else if (role) {
      // 新格式 - 更新现有角色
      try {
        const existingData = JSON.parse(role.value);
        roleData = JSON.stringify({
          ...existingData,
          name: updateDto.name !== undefined ? updateDto.name : existingData.name,
          description: updateDto.description !== undefined ? updateDto.description : existingData.description,
          scope: updateDto.scope !== undefined ? updateDto.scope : existingData.scope,
          isSystem: updateDto.isSystem !== undefined ? updateDto.isSystem : existingData.isSystem,
          permissions: updateDto.permissions !== undefined ? updateDto.permissions : existingData.permissions
        });
      } catch {
        roleData = JSON.stringify({
          name: updateDto.name || key,
          description: updateDto.description || '',
          scope: updateDto.scope || 'self',
          isSystem: updateDto.isSystem || false,
          permissions: updateDto.permissions || {}
        });
      }
    } else {
      // 新格式 - 创建新角色
      roleData = JSON.stringify({
        name: updateDto.name || key,
        description: updateDto.description || '',
        scope: updateDto.scope || 'self',
        isSystem: updateDto.isSystem || false,
        permissions: updateDto.permissions || {}
      });
    }

    if (role) {
      role.value = roleData;
      if (updateDto.description !== undefined) {
        role.description = updateDto.description;
      }
    } else {
      role = this.rolesRepository.create({
        key,
        value: roleData,
        description: updateDto.description,
      });
    }

    return await this.rolesRepository.save(role);
  }

  /**
   * 批量更新角色
   */
  async batchUpdate(roles: Record<string, any>): Promise<{ success: boolean; updated: number }> {
    let updated = 0;

    for (const [key, value] of Object.entries(roles)) {
      await this.update(key, { value: typeof value === 'string' ? value : JSON.stringify(value) });
      updated++;
    }

    return { success: true, updated };
  }

  /**
   * 删除角色
   */
  async remove(key: string): Promise<void> {
    await this.rolesRepository.delete({ key });
  }

  /**
   * 获取权限树
   */
  async getPermissionTree() {
    // 定义系统所有可用权限的树形结构
    return [
      {
        key: 'users',
        label: '用户管理',
        children: [
          { key: 'users.view', label: '查看用户' },
          { key: 'users.create', label: '创建用户' },
          { key: 'users.edit', label: '编辑用户' },
          { key: 'users.delete', label: '删除用户' },
          { key: 'users.all', label: '所有权限' },
        ],
      },
      {
        key: 'roles',
        label: '角色管理',
        children: [
          { key: 'roles.view', label: '查看角色' },
          { key: 'roles.create', label: '创建角色' },
          { key: 'roles.edit', label: '编辑角色' },
          { key: 'roles.delete', label: '删除角色' },
          { key: 'roles.all', label: '所有权限' },
        ],
      },
      {
        key: 'projects',
        label: '项目管理',
        children: [
          { key: 'projects.view', label: '查看项目' },
          { key: 'projects.create', label: '创建项目' },
          { key: 'projects.edit', label: '编辑项目' },
          { key: 'projects.delete', label: '删除项目' },
          { key: 'projects.publish', label: '发布项目' },
          { key: 'projects.all', label: '所有权限' },
        ],
      },
      {
        key: 'templates',
        label: '模板管理',
        children: [
          { key: 'templates.view', label: '查看模板' },
          { key: 'templates.create', label: '创建模板' },
          { key: 'templates.edit', label: '编辑模板' },
          { key: 'templates.delete', label: '删除模板' },
          { key: 'templates.publish', label: '发布模板' },
          { key: 'templates.all', label: '所有权限' },
        ],
      },
      {
        key: 'datasets',
        label: '数据集管理',
        children: [
          { key: 'datasets.view', label: '查看数据集' },
          { key: 'datasets.create', label: '创建数据集' },
          { key: 'datasets.edit', label: '编辑数据集' },
          { key: 'datasets.delete', label: '删除数据集' },
          { key: 'datasets.all', label: '所有权限' },
        ],
      },
      {
        key: 'connections',
        label: '数据源连接',
        children: [
          { key: 'connections.view', label: '查看连接' },
          { key: 'connections.create', label: '创建连接' },
          { key: 'connections.edit', label: '编辑连接' },
          { key: 'connections.delete', label: '删除连接' },
          { key: 'connections.all', label: '所有权限' },
        ],
      },
      {
        key: 'media',
        label: '媒体资源',
        children: [
          { key: 'media.view', label: '查看媒体' },
          { key: 'media.upload', label: '上传媒体' },
          { key: 'media.edit', label: '编辑媒体' },
          { key: 'media.delete', label: '删除媒体' },
          { key: 'media.all', label: '所有权限' },
        ],
      },
      {
        key: 'components',
        label: '组件库',
        children: [
          { key: 'components.view', label: '查看组件' },
          { key: 'components.create', label: '创建组件' },
          { key: 'components.edit', label: '编辑组件' },
          { key: 'components.delete', label: '删除组件' },
          { key: 'components.all', label: '所有权限' },
        ],
      },
      {
        key: 'system',
        label: '系统设置',
        children: [
          { key: 'system.view', label: '查看设置' },
          { key: 'system.config', label: '修改配置' },
          { key: 'system.backup', label: '备份数据' },
          { key: 'system.restore', label: '恢复数据' },
          { key: 'system.all', label: '所有权限' },
        ],
      },
      {
        key: 'security',
        label: '安全管理',
        children: [
          { key: 'security.view', label: '查看安全日志' },
          { key: 'security.config', label: '配置安全策略' },
          { key: 'security.all', label: '所有权限' },
        ],
      },
    ];
  }

  /**
   * 获取角色权限
   */
  async getRolePermissions(id: number): Promise<any> {
    const role = await this.rolesRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException(`角色 ID ${id} 不存在`);
    }

    try {
      const data = JSON.parse(role.value);
      return data.permissions || {};
    } catch {
      return {};
    }
  }

  /**
   * 更新角色权限
   */
  async updateRolePermissions(id: number, permissions: any): Promise<any> {
    const role = await this.rolesRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException(`角色 ID ${id} 不存在`);
    }

    try {
      const data = JSON.parse(role.value);
      data.permissions = permissions;
      role.value = JSON.stringify(data);
      await this.rolesRepository.save(role);
      return { success: true, permissions };
    } catch (error) {
      throw new Error('更新权限失败');
    }
  }
}
