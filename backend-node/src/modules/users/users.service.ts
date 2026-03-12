import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseService } from '../../common/base/base.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 检查用户名是否已存在
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('用户名或邮箱已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return super.findAll({
      relations: ['role', 'department'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    return super.findOne(id, ['role', 'department']);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.findOneBy({ username }, ['role', 'department']);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email }, ['role', 'department']);
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.findOneBy({ phone }, ['role', 'department']);
  }

  async findByUsernameOrEmailOrPhone(identifier: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [
        { username: identifier },
        { email: identifier },
        { phone: identifier }
      ],
      relations: ['role', 'department']
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // 如果更新密码，需要加密
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return super.update(id, updateUserDto);
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // 检查邮箱是否被其他用户使用
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('邮箱已被使用');
      }
    }

    // 检查手机号是否被其他用户使用
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingUser = await this.usersRepository.findOne({
        where: { phone: updateUserDto.phone },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('手机号已被使用');
      }
    }

    // 更新用户资料（不包括密码）
    const { password, ...profileData } = updateUserDto;
    Object.assign(user, profileData);

    return this.usersRepository.save(user);
  }

  async uploadAvatar(userId: number, file: Express.Multer.File): Promise<{ url: string }> {
    // 1. 验证文件类型
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('不支持的文件类型，仅支持 JPEG、PNG、GIF、WebP 格式');
    }

    // 2. 验证文件大小（2MB）
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('文件大小超过限制（最大 2MB）');
    }

    // 3. 保存文件
    const fs = require('fs').promises;
    const path = require('path');
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');

    // 确保目录存在
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // 清理文件名
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(sanitizedName);
    const filename = `${userId}-${Date.now()}${ext}`;
    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, file.buffer);

    const avatarUrl = `/uploads/avatars/${filename}`;

    // 4. 更新用户头像
    const user = await this.findOne(userId);
    user.avatar = avatarUrl;
    await this.usersRepository.save(user);

    return { url: avatarUrl };
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 验证旧密码
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('旧密码不正确');
    }

    // 验证新密码强度
    if (newPassword.length < 6) {
      throw new BadRequestException('新密码长度至少为6位');
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.usersRepository.save(user);

    return { message: '密码修改成功' };
  }
}
