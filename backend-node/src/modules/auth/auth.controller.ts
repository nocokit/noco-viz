import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新用户信息' })
  updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: '修改密码' })
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.new_password !== changePasswordDto.new_password_confirm) {
      throw new BadRequestException('两次输入的新密码不一致');
    }
    return this.authService.changePassword(
      req.user.id,
      changePasswordDto.old_password,
      changePasswordDto.new_password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: '刷新 Token' })
  refreshToken(@Request() req) {
    // 从 Authorization header 中获取 token
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.refreshToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: '退出登录' })
  logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}
