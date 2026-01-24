import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiProduces,
  getSchemaPath,
} from '@nestjs/swagger';

/**
 * 标准 CRUD 操作的 Swagger 装饰器组合
 */

/**
 * 列表查询接口装饰器
 */
export function ApiList(summary: string, description?: string) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiResponse({
      status: 200,
      description: '成功获取列表',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'array', items: { type: 'object' } },
          timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          path: { type: 'string', example: '/api/resource' },
        },
      },
    }),
    ApiResponse({ status: 401, description: '未授权' }),
    ApiResponse({ status: 500, description: '服务器错误' }),
  );
}

/**
 * 分页列表接口装饰器
 */
export function ApiPaginatedList(summary: string, description?: string) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiQuery({ name: 'page', required: false, type: Number, description: '页码', example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: '每页数量', example: 20 }),
    ApiQuery({ name: 'search', required: false, type: String, description: '搜索关键词' }),
    ApiResponse({
      status: 200,
      description: '成功获取分页列表',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'array', items: { type: 'object' } },
          pagination: {
            type: 'object',
            properties: {
              total: { type: 'number', example: 100 },
              page: { type: 'number', example: 1 },
              pageSize: { type: 'number', example: 20 },
              totalPages: { type: 'number', example: 5 },
            },
          },
          timestamp: { type: 'string' },
          path: { type: 'string' },
        },
      },
    }),
    ApiResponse({ status: 401, description: '未授权' }),
    ApiResponse({ status: 500, description: '服务器错误' }),
  );
}

/**
 * 获取详情接口装饰器
 */
export function ApiGetOne(summary: string, description?: string) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiParam({ name: 'id', type: 'number', description: '资源ID' }),
    ApiResponse({
      status: 200,
      description: '成功获取详情',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          timestamp: { type: 'string' },
          path: { type: 'string' },
        },
      },
    }),
    ApiResponse({ status: 404, description: '资源不存在' }),
    ApiResponse({ status: 401, description: '未授权' }),
    ApiResponse({ status: 500, description: '服务器错误' }),
  );
}

/**
 * 创建资源接口装饰器
 */
export function ApiCreate(summary: string, type?: Type<any>, description?: string) {
  const decorators = [
    ApiOperation({ summary, description }),
    ApiResponse({
      status: 201,
      description: '创建成功',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          message: { type: 'string', example: '创建成功' },
          timestamp: { type: 'string' },
          path: { type: 'string' },
        },
      },
    }),
    ApiResponse({ status: 400, description: '参数验证失败' }),
    ApiResponse({ status: 401, description: '未授权' }),
    ApiResponse({ status: 409, description: '资源已存在' }),
    ApiResponse({ status: 500, description: '服务器错误' }),
  ];

  if (type) {
    decorators.push(ApiBody({ type }));
  }

  return applyDecorators(...decorators);
}

/**
 * 更新资源接口装饰器
 */
export function ApiUpdate(summary: string, type?: Type<any>, description?: string) {
  const decorators = [
    ApiOperation({ summary, description }),
    ApiParam({ name: 'id', type: 'number', description: '资源ID' }),
    ApiResponse({
      status: 200,
      description: '更新成功',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          message: { type: 'string', example: '更新成功' },
          timestamp: { type: 'string' },
          path: { type: 'string' },
        },
      },
    }),
    ApiResponse({ status: 400, description: '参数验证失败' }),
    ApiResponse({ status: 404, description: '资源不存在' }),
    ApiResponse({ status: 401, description: '未授权' }),
    ApiResponse({ status: 500, description: '服务器错误' }),
  ];

  if (type) {
    decorators.push(ApiBody({ type }));
  }

  return applyDecorators(...decorators);
}

/**
 * 删除资源接口装饰器
 */
export function ApiDelete(summary: string, description?: string) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiParam({ name: 'id', type: 'number', description: '资源ID' }),
    ApiResponse({
      status: 200,
      description: '删除成功',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'null', example: null },
          message: { type: 'string', example: '删除成功' },
          timestamp: { type: 'string' },
          path: { type: 'string' },
        },
      },
    }),
    ApiResponse({ status: 404, description: '资源不存在' }),
    ApiResponse({ status: 401, description: '未授权' }),
    ApiResponse({ status: 500, description: '服务器错误' }),
  );
}

/**
 * 批量删除接口装饰器
 */
export function ApiBatchDelete(summary: string, description?: string) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiBody({
      schema: {
        properties: {
          ids: {
            type: 'array',
            items: { type: 'number' },
            example: [1, 2, 3],
            description: '要删除的资源ID数组',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '批量删除成功',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: '批量删除成功' },
          timestamp: { type: 'string' },
          path: { type: 'string' },
        },
      },
    }),
    ApiResponse({ status: 400, description: '参数验证失败' }),
    ApiResponse({ status: 401, description: '未授权' }),
    ApiResponse({ status: 500, description: '服务器错误' }),
  );
}

/**
 * 文件上传接口装饰器
 */
export function ApiFileUpload(summary: string, description?: string) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: '上传的文件',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: '文件上传成功',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              url: { type: 'string', example: '/uploads/file.jpg' },
              filename: { type: 'string', example: 'file.jpg' },
              size: { type: 'number', example: 1024 },
            },
          },
          timestamp: { type: 'string' },
          path: { type: 'string' },
        },
      },
    }),
    ApiResponse({ status: 400, description: '文件格式不正确或文件过大' }),
    ApiResponse({ status: 401, description: '未授权' }),
    ApiResponse({ status: 500, description: '服务器错误' }),
  );
}

/**
 * 需要认证的接口装饰器
 */
export function ApiAuth(summary: string, description?: string) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary, description }),
    ApiResponse({ status: 401, description: '未授权或Token无效' }),
    ApiResponse({ status: 403, description: '权限不足' }),
  );
}

/**
 * 完整的 CRUD 资源装饰器
 * 为整个 Controller 添加标签和认证
 */
export function ApiCrudResource(
  tag: string,
  options: {
    requireAuth?: boolean;
    description?: string;
  } = {},
) {
  const decorators = [ApiTags(tag)];

  if (options.requireAuth) {
    decorators.push(ApiBearerAuth());
  }

  return applyDecorators(...decorators);
}

/**
 * 自定义操作装饰器
 */
export function ApiCustomOperation(
  summary: string,
  options: {
    description?: string;
    successStatus?: number;
    successMessage?: string;
    params?: Array<{ name: string; type: string; description?: string }>;
    queries?: Array<{ name: string; type: string; required?: boolean; description?: string }>;
  } = {},
) {
  const decorators = [
    ApiOperation({ summary, description: options.description }),
    ApiResponse({
      status: options.successStatus || 200,
      description: options.successMessage || '操作成功',
    }),
    ApiResponse({ status: 400, description: '参数错误' }),
    ApiResponse({ status: 401, description: '未授权' }),
    ApiResponse({ status: 500, description: '服务器错误' }),
  ];

  // 添加路径参数
  if (options.params) {
    options.params.forEach((param) => {
      decorators.push(
        ApiParam({
          name: param.name,
          type: param.type as any,
          description: param.description,
        }),
      );
    });
  }

  // 添加查询参数
  if (options.queries) {
    options.queries.forEach((query) => {
      decorators.push(
        ApiQuery({
          name: query.name,
          type: query.type as any,
          required: query.required,
          description: query.description,
        }),
      );
    });
  }

  return applyDecorators(...decorators);
}

/**
 * 导出/下载接口装饰器
 */
export function ApiExport(summary: string, description?: string) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiProduces('application/octet-stream', 'application/json'),
    ApiResponse({
      status: 200,
      description: '导出成功',
      content: {
        'application/octet-stream': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: '未授权' }),
    ApiResponse({ status: 500, description: '服务器错误' }),
  );
}
