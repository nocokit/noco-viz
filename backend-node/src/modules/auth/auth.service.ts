import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    // 支持用户名、邮箱、手机号登录
    const user = await this.usersService.findByUsernameOrEmailOrPhone(username);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('账户已被禁用');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      // roleId: user.roleId, // 已屏蔽：复杂权限系统
    };

    // 生成 access token (10天)
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10d' });

    // 生成 refresh token (30天)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    // 更新最后登录时间
    user.lastLogin = new Date();
    await this.usersService.update(user.id, { lastLogin: user.lastLogin } as any);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 864000, // 10 days in seconds
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        // roleId: user.roleId, // 已屏蔽：复杂权限系统
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create({
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
      phone: registerDto.phone,
    });

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      // roleId: user.roleId, // 已屏蔽：复杂权限系统
    };

    // 生成 access token (10天)
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10d' });

    // 生成 refresh token (30天)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 864000, // 10 days in seconds
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    };
  }

  async getProfile(userId: number) {
    return this.usersService.findOne(userId);
  }

  async updateProfile(userId: number, updateData: any) {
    return this.usersService.update(userId, updateData);
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('原密码错误');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(userId, { password: hashedPassword } as any);

    return { message: '密码修改成功' };
  }

  async refreshToken(refreshToken: string) {
    try {
      // 验证 refresh token
      const payload = this.jwtService.verify(refreshToken);

      // 获取用户信息
      const user = await this.usersService.findOne(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('用户不存在或已被禁用');
      }

      // 生成新的 access token (10天)
      const newPayload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        // roleId: user.roleId, // 已屏蔽：复杂权限系统
      };

      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '10d' });

      // 生成新的 refresh token (30天)
      const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '30d' });

      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
        token_type: 'Bearer',
        expires_in: 864000, // 10 days in seconds
      };
    } catch (error) {
      throw new UnauthorizedException('无效的 refresh token');
    }
  }

  async logout(userId: number) {
    // 可以在这里添加 token 黑名单逻辑
    return { message: '退出登录成功' };
  }
}
