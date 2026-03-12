import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BatchUpdateRoleDto } from './dto/batch-update-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: '创建角色' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有角色' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('permissions/tree')
  @ApiOperation({ summary: '获取权限树' })
  getPermissionTree() {
    return this.rolesService.getPermissionTree();
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: '获取角色权限' })
  getRolePermissions(@Param('id') id: string) {
    return this.rolesService.getRolePermissions(+id);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: '更新角色权限' })
  updateRolePermissions(@Param('id') id: string, @Body() body: { permissions: any }) {
    return this.rolesService.updateRolePermissions(+id, body.permissions);
  }

  @Get(':key')
  @ApiOperation({ summary: '获取单个角色' })
  findOne(@Param('key') key: string) {
    return this.rolesService.findOne(key);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色' })
  async updateById(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    // 先通过 ID 查找角色获取 key
    const role = await this.rolesService.findById(+id);
    return this.rolesService.update(role.key, updateRoleDto);
  }

  @Put('key/:key')
  @ApiOperation({ summary: '通过key更新角色' })
  update(@Param('key') key: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(key, updateRoleDto);
  }

  @Post('batch')
  @ApiOperation({ summary: '批量更新角色' })
  batchUpdate(@Body() batchUpdateDto: BatchUpdateRoleDto) {
    return this.rolesService.batchUpdate(batchUpdateDto.roles);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  async removeById(@Param('id') id: string) {
    // 先通过 ID 查找角色获取 key
    const role = await this.rolesService.findById(+id);
    return this.rolesService.remove(role.key);
  }

  @Delete('key/:key')
  @ApiOperation({ summary: '通过key删除角色' })
  remove(@Param('key') key: string) {
    return this.rolesService.remove(key);
  }
}
