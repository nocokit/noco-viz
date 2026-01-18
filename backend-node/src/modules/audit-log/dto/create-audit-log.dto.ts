export class CreateAuditLogDto {
  userId?: number;
  userName?: string;
  ipAddress: string;
  userAgent?: string;
  module: string;
  action: string;
  actionType: string;
  description: string;
  requestMethod?: string;
  requestUrl?: string;
  requestBody?: string;
  responseStatus?: number;
  error?: string;
  status: string;
  traceId?: string;
}
