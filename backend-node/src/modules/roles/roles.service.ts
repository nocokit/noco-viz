import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/base/base.service';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {
    super(rolesRepository);
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.rolesRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('角色名称已存在');
    }

    const role = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  async findAll(): Promise<any[]> {
    const roles = await this.rolesRepository.find({
      relations: ['users'],
      order: { createdAt: 'DESC' },
    });

    return roles.map(role => ({
      ...role,
      userCount: role.users?.length || 0,
      users: undefined, // Remove users array from response
    }));
  }

  async findOne(id: number): Promise<any> {
    const role = await super.findOne(id, ['users']);

    return {
      ...role,
      userCount: role.users?.length || 0,
      users: undefined, // Remove users array from response
    };
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (role.isSystem) {
      throw new ConflictException('系统内置角色不能修改');
    }

    return super.update(id, updateRoleDto);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);

    if (role.isSystem) {
      throw new ConflictException('系统内置角色不能删除');
    }

    await super.remove(id);
  }

  async importRoles(roles: CreateRoleDto[]): Promise<{ success: number; failed: number; errors: any[] }> {
    const result = { success: 0, failed: 0, errors: [] };

    for (const roleDto of roles) {
      try {
        await this.create(roleDto);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({ role: roleDto.name, error: error.message });
      }
    }

    return result;
  }

  async exportRoles(roleIds?: number[]): Promise<any[]> {
    if (roleIds && roleIds.length > 0) {
      const roles = await this.rolesRepository.find({
        where: roleIds.map(id => ({ id })),
        relations: ['users'],
      });
      return roles.map(role => ({
        ...role,
        userCount: role.users?.length || 0,
        users: undefined,
      }));
    }
    return this.findAll();
  }

  async validateRoles(roles: any[]): Promise<{ valid: boolean; errors: any[] }> {
    const errors = [];

    for (const role of roles) {
      if (!role.name) {
        errors.push({ role, error: '角色名称不能为空' });
      }

      if (role.name) {
        const existing = await this.rolesRepository.findOne({
          where: { name: role.name },
        });
        if (existing) {
          errors.push({ role: role.name, error: '角色名称已存在' });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  async getPermissionTree(): Promise<any> {
    // 返回完整的权限树结构
    return {
      permissions: [
        {
          id: 'workspace',
          label: '工作台',
          children: [
            {
              id: 'project',
              label: '项目管理',
              children: [
                { id: 'project:view', label: '查看项目' },
                { id: 'project:create', label: '创建项目' },
                { id: 'project:edit', label: '编辑项目' },
                { id: 'project:delete', label: '删除项目' },
                { id: 'project:publish', label: '发布项目' },
              ],
            },
            {
              id: 'playlist',
              label: '轮播管理',
              children: [
                { id: 'playlist:view', label: '查看轮播' },
                { id: 'playlist:create', label: '创建轮播' },
                { id: 'playlist:edit', label: '编辑轮播' },
                { id: 'playlist:delete', label: '删除轮播' },
              ],
            },
            {
              id: 'template',
              label: '模板库',
              children: [
                { id: 'template:view', label: '查看模板' },
                { id: 'template:create', label: '创建模板' },
                { id: 'template:edit', label: '编辑模板' },
                { id: 'template:delete', label: '删除模板' },
                { id: 'template:publish', label: '发布模板' },
              ],
            },
          ],
        },
        {
          id: 'data',
          label: '数据中心',
          children: [
            {
              id: 'connection',
              label: '连接配置',
              children: [
                { id: 'connection:view', label: '查看连接' },
                { id: 'connection:create', label: '创建连接' },
                { id: 'connection:edit', label: '编辑连接' },
                { id: 'connection:delete', label: '删除连接' },
                { id: 'connection:test', label: '测试连接' },
              ],
            },
            {
              id: 'dataset',
              label: '数据集管理',
              children: [
                { id: 'dataset:view', label: '查看数据集' },
                { id: 'dataset:create', label: '创建数据集' },
                { id: 'dataset:edit', label: '编辑数据集' },
                { id: 'dataset:delete', label: '删除数据集' },
                { id: 'dataset:execute', label: '执行查询' },
              ],
            },
          ],
        },
        {
          id: 'assets',
          label: '资产管理',
          children: [
            {
              id: 'media',
              label: '媒体资源库',
              children: [
                { id: 'media:view', label: '查看媒体' },
                { id: 'media:upload', label: '上传媒体' },
                { id: 'media:edit', label: '编辑媒体' },
                { id: 'media:delete', label: '删除媒体' },
              ],
            },
            {
              id: 'component',
              label: '自定义组件',
              children: [
                { id: 'component:view', label: '查看组件' },
                { id: 'component:create', label: '创建组件' },
                { id: 'component:edit', label: '编辑组件' },
                { id: 'component:delete', label: '删除组件' },
              ],
            },
          ],
        },
        {
          id: 'security',
          label: '安全与权限',
          children: [
            {
              id: 'user',
              label: '用户管理',
              children: [
                { id: 'user:view', label: '查看用户' },
                { id: 'user:create', label: '创建用户' },
                { id: 'user:edit', label: '编辑用户' },
                { id: 'user:delete', label: '删除用户' },
                { id: 'user:resetPassword', label: '重置密码' },
              ],
            },
            {
              id: 'department',
              label: '组织架构',
              children: [
                { id: 'department:view', label: '查看部门' },
                { id: 'department:create', label: '创建部门' },
                { id: 'department:edit', label: '编辑部门' },
                { id: 'department:delete', label: '删除部门' },
              ],
            },
            {
              id: 'role',
              label: '角色管理',
              children: [
                { id: 'role:view', label: '查看角色' },
                { id: 'role:create', label: '创建角色' },
                { id: 'role:edit', label: '编辑角色' },
                { id: 'role:delete', label: '删除角色' },
                { id: 'role:assign', label: '分配角色' },
              ],
            },
            {
              id: 'audit',
              label: '审计日志',
              children: [
                { id: 'audit:view', label: '查看日志' },
                { id: 'audit:export', label: '导出日志' },
              ],
            },
          ],
        },
        {
          id: 'operations',
          label: '运维中心',
          children: [
            {
              id: 'monitor',
              label: '系统监控',
              children: [
                { id: 'monitor:view', label: '查看监控' },
                { id: 'monitor:manage', label: '管理监控' },
              ],
            },
            {
              id: 'integration',
              label: '集成发布',
              children: [
                { id: 'integration:view', label: '查看集成' },
                { id: 'integration:publish', label: '发布集成' },
              ],
            },
          ],
        },
        {
          id: 'system',
          label: '系统设置',
          children: [
            {
              id: 'config',
              label: '系统配置',
              children: [
                { id: 'config:view', label: '查看配置' },
                { id: 'config:edit', label: '编辑配置' },
              ],
            },
            {
              id: 'whitelist',
              label: 'IP白名单',
              children: [
                { id: 'whitelist:view', label: '查看白名单' },
                { id: 'whitelist:create', label: '创建白名单' },
                { id: 'whitelist:edit', label: '编辑白名单' },
                { id: 'whitelist:delete', label: '删除白名单' },
              ],
            },
            {
              id: 'backup',
              label: '备份恢复',
              children: [
                { id: 'backup:view', label: '查看备份' },
                { id: 'backup:create', label: '创建备份' },
                { id: 'backup:restore', label: '恢复备份' },
                { id: 'backup:delete', label: '删除备份' },
              ],
            },
            {
              id: 'recycle',
              label: '回收站',
              children: [
                { id: 'recycle:view', label: '查看回收站' },
                { id: 'recycle:restore', label: '恢复数据' },
                { id: 'recycle:delete', label: '彻底删除' },
              ],
            },
          ],
        },
      ],
    };
  }

  async cloneRole(id: number, newName: string): Promise<Role> {
    const sourceRole = await this.findOne(id);

    const newRole = this.rolesRepository.create({
      name: newName,
      description: sourceRole.description,
      scope: sourceRole.scope,
      permissions: sourceRole.permissions,
      isSystem: false,
    });

    return this.rolesRepository.save(newRole);
  }
}
