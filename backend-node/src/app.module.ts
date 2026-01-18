import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { dataSourceOptions } from './config/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { DatasetsModule } from './modules/datasets/datasets.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { AuthModule } from './modules/auth/auth.module';
import { IpWhitelistModule } from './ip-whitelist/ip-whitelist.module';
import { SystemConfigModule } from './modules/system-config/system-config.module';
import { MediaModule } from './modules/media/media.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { BackupModule } from './modules/backup/backup.module';
import { RecycleModule } from './modules/recycle/recycle.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ComponentsModule } from './modules/components/components.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    RolesModule,
    ProjectsModule,
    DatasetsModule,
    TemplatesModule,
    IpWhitelistModule,
    SystemConfigModule,
    MediaModule,
    PlaylistsModule,
    BackupModule,
    RecycleModule,
    AuditLogModule,
    DepartmentsModule,
    ComponentsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
