import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpWhitelistController } from './ip-whitelist.controller';
import { IpWhitelistService } from './ip-whitelist.service';
import { IpWhitelist } from './entities/ip-whitelist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IpWhitelist])],
  controllers: [IpWhitelistController],
  providers: [IpWhitelistService],
  exports: [IpWhitelistService],
})
export class IpWhitelistModule {}
