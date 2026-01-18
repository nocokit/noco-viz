import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
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

  @Get(':id')
  @ApiOperation({ summary: '获取角色详情' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新角色（部分）' })
  patch(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  @Post('import')
  @ApiOperation({ summary: '批量导入角色' })
  importRoles(@Body() body: { roles: CreateRoleDto[] }) {
    return this.rolesService.importRoles(body.roles);
  }

  @Post('export')
  @ApiOperation({ summary: '导出角色' })
  async exportRoles(@Body() body: { roleIds?: number[] }, @Res() res: Response) {
    const roles = await this.rolesService.exportRoles(body.roleIds);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=roles.json');
    res.send(JSON.stringify(roles, null, 2));
  }

  @Post('upload')
  @ApiOperation({ summary: '上传角色JSON文件' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRoleFile(@UploadedFile() file: Express.Multer.File) {
    const roles = JSON.parse(file.buffer.toString());
    return this.rolesService.importRoles(roles);
  }

  @Post('validate')
  @ApiOperation({ summary: '验证角色数据' })
  validateRoles(@Body() body: { roles: any[] }) {
    return this.rolesService.validateRoles(body.roles);
  }

  @Post(':id/clone')
  @ApiOperation({ summary: '复制角色' })
  cloneRole(@Param('id') id: string, @Body() body: { name: string }) {
    return this.rolesService.cloneRole(+id, body.name);
  }
}
