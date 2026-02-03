import { Controller, Get, UseGuards } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/monitor')
@UseGuards(JwtAuthGuard)
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Get()
  getMonitorData() {
    return this.monitorService.getMonitorData();
  }

  @Get('system')
  getSystemResources() {
    return this.monitorService.getSystemResources();
  }

  @Get('application')
  getApplicationStats() {
    return this.monitorService.getApplicationStats();
  }

  @Get('activities')
  getRecentActivities() {
    return this.monitorService.getRecentActivities();
  }

  @Get('api-stats')
  getApiStats() {
    return this.monitorService.getApiStats();
  }

  @Get('errors')
  getErrorStats() {
    return this.monitorService.getErrorStats();
  }
}
