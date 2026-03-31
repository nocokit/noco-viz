import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-super-secret-jwt-key-change-in-production',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      // roleId: payload.roleId, // 已屏蔽：复杂权限系统
    };
  }
}
