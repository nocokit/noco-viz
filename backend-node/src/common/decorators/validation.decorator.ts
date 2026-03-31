import { applyDecorators } from '@nestjs/common';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsInt,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  IsDate,
  MinLength,
  MaxLength,
  Min,
  Max,
  Matches,
  IsUrl,
  IsUUID,
  IsPhoneNumber,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsObject,
  IsJSON,
  IsPositive,
  IsNegative,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 必填字符串
 * @param options 配置选项
 */
export function IsRequiredString(options: {
  minLength?: number;
  maxLength?: number;
  description?: string;
  example?: string;
} = {}) {
  const decorators = [
    IsString({ message: '必须是字符串类型' }),
    IsNotEmpty({ message: '不能为空' }),
  ];

  if (options.minLength) {
    decorators.push(
      MinLength(options.minLength, {
        message: `长度不能少于${options.minLength}个字符`,
      }),
    );
  }

  if (options.maxLength) {
    decorators.push(
      MaxLength(options.maxLength, {
        message: `长度不能超过${options.maxLength}个字符`,
      }),
    );
  }

  decorators.push(
    ApiProperty({
      description: options.description,
      example: options.example,
      minLength: options.minLength,
      maxLength: options.maxLength,
    }),
  );

  return applyDecorators(...decorators);
}

/**
 * 可选字符串
 * @param options 配置选项
 */
export function IsOptionalString(options: {
  minLength?: number;
  maxLength?: number;
  description?: string;
  example?: string;
} = {}) {
  const decorators = [
    IsOptional(),
    IsString({ message: '必须是字符串类型' }),
  ];

  if (options.minLength) {
    decorators.push(
      MinLength(options.minLength, {
        message: `长度不能少于${options.minLength}个字符`,
      }),
    );
  }

  if (options.maxLength) {
    decorators.push(
      MaxLength(options.maxLength, {
        message: `长度不能超过${options.maxLength}个字符`,
      }),
    );
  }

  decorators.push(
    ApiPropertyOptional({
      description: options.description,
      example: options.example,
      minLength: options.minLength,
      maxLength: options.maxLength,
    }),
  );

  return applyDecorators(...decorators);
}

/**
 * 必填邮箱
 * @param options 配置选项
 */
export function IsRequiredEmail(options: {
  description?: string;
  example?: string;
} = {}) {
  return applyDecorators(
    IsString({ message: '必须是字符串类型' }),
    IsNotEmpty({ message: '邮箱不能为空' }),
    IsEmail({}, { message: '邮箱格式不正确' }),
    ApiProperty({
      description: options.description || '邮箱地址',
      example: options.example || 'user@example.com',
    }),
  );
}

/**
 * 可选邮箱
 * @param options 配置选项
 */
export function IsOptionalEmail(options: {
  description?: string;
  example?: string;
} = {}) {
  return applyDecorators(
    IsOptional(),
    IsEmail({}, { message: '邮箱格式不正确' }),
    ApiPropertyOptional({
      description: options.description || '邮箱地址',
      example: options.example || 'user@example.com',
    }),
  );
}

/**
 * 必填数字
 * @param options 配置选项
 */
export function IsRequiredNumber(options: {
  min?: number;
  max?: number;
  description?: string;
  example?: number;
} = {}) {
  const decorators = [
    IsNumber({}, { message: '必须是数字类型' }),
    IsNotEmpty({ message: '不能为空' }),
  ];

  if (options.min !== undefined) {
    decorators.push(
      Min(options.min, { message: `不能小于${options.min}` }),
    );
  }

  if (options.max !== undefined) {
    decorators.push(
      Max(options.max, { message: `不能大于${options.max}` }),
    );
  }

  decorators.push(
    ApiProperty({
      description: options.description,
      example: options.example,
      minimum: options.min,
      maximum: options.max,
    }),
  );

  return applyDecorators(...decorators);
}

/**
 * 必填整数
 * @param options 配置选项
 */
export function IsRequiredInt(options: {
  min?: number;
  max?: number;
  description?: string;
  example?: number;
} = {}) {
  const decorators = [
    IsInt({ message: '必须是整数类型' }),
    IsNotEmpty({ message: '不能为空' }),
  ];

  if (options.min !== undefined) {
    decorators.push(
      Min(options.min, { message: `不能小于${options.min}` }),
    );
  }

  if (options.max !== undefined) {
    decorators.push(
      Max(options.max, { message: `不能大于${options.max}` }),
    );
  }

  decorators.push(
    ApiProperty({
      description: options.description,
      example: options.example,
      minimum: options.min,
      maximum: options.max,
      type: 'integer',
    }),
  );

  return applyDecorators(...decorators);
}

/**
 * 可选整数
 * @param options 配置选项
 */
export function IsOptionalInt(options: {
  min?: number;
  max?: number;
  description?: string;
  example?: number;
} = {}) {
  const decorators = [IsOptional(), IsInt({ message: '必须是整数类型' })];

  if (options.min !== undefined) {
    decorators.push(
      Min(options.min, { message: `不能小于${options.min}` }),
    );
  }

  if (options.max !== undefined) {
    decorators.push(
      Max(options.max, { message: `不能大于${options.max}` }),
    );
  }

  decorators.push(
    ApiPropertyOptional({
      description: options.description,
      example: options.example,
      minimum: options.min,
      maximum: options.max,
      type: 'integer',
    }),
  );

  return applyDecorators(...decorators);
}

/**
 * 必填布尔值
 * @param options 配置选项
 */
export function IsRequiredBoolean(options: {
  description?: string;
  example?: boolean;
} = {}) {
  return applyDecorators(
    IsBoolean({ message: '必须是布尔类型' }),
    IsNotEmpty({ message: '不能为空' }),
    ApiProperty({
      description: options.description,
      example: options.example,
      type: 'boolean',
    }),
  );
}

/**
 * 可选布尔值
 * @param options 配置选项
 */
export function IsOptionalBoolean(options: {
  description?: string;
  example?: boolean;
} = {}) {
  return applyDecorators(
    IsOptional(),
    IsBoolean({ message: '必须是布尔类型' }),
    ApiPropertyOptional({
      description: options.description,
      example: options.example,
      type: 'boolean',
    }),
  );
}

/**
 * 必填枚举
 * @param enumType 枚举类型
 * @param options 配置选项
 */
export function IsRequiredEnum(
  enumType: object,
  options: {
    description?: string;
    example?: any;
  } = {},
) {
  return applyDecorators(
    IsEnum(enumType, { message: '枚举值不正确' }),
    IsNotEmpty({ message: '不能为空' }),
    ApiProperty({
      description: options.description,
      example: options.example,
      enum: enumType,
    }),
  );
}

/**
 * 可选枚举
 * @param enumType 枚举类型
 * @param options 配置选项
 */
export function IsOptionalEnum(
  enumType: object,
  options: {
    description?: string;
    example?: any;
  } = {},
) {
  return applyDecorators(
    IsOptional(),
    IsEnum(enumType, { message: '枚举值不正确' }),
    ApiPropertyOptional({
      description: options.description,
      example: options.example,
      enum: enumType,
    }),
  );
}

/**
 * 必填数组
 * @param options 配置选项
 */
export function IsRequiredArray(options: {
  minSize?: number;
  maxSize?: number;
  description?: string;
  example?: any[];
} = {}) {
  const decorators = [
    IsArray({ message: '必须是数组类型' }),
    IsNotEmpty({ message: '不能为空' }),
  ];

  if (options.minSize) {
    decorators.push(
      ArrayMinSize(options.minSize, {
        message: `数组长度不能少于${options.minSize}`,
      }),
    );
  }

  if (options.maxSize) {
    decorators.push(
      ArrayMaxSize(options.maxSize, {
        message: `数组长度不能超过${options.maxSize}`,
      }),
    );
  }

  decorators.push(
    ApiProperty({
      description: options.description,
      example: options.example,
      type: 'array',
    }),
  );

  return applyDecorators(...decorators);
}

/**
 * 必填URL
 * @param options 配置选项
 */
export function IsRequiredUrl(options: {
  description?: string;
  example?: string;
} = {}) {
  return applyDecorators(
    IsString({ message: '必须是字符串类型' }),
    IsNotEmpty({ message: 'URL不能为空' }),
    IsUrl({}, { message: 'URL格式不正确' }),
    ApiProperty({
      description: options.description || 'URL地址',
      example: options.example || 'https://example.com',
    }),
  );
}

/**
 * 手机号验证
 * @param options 配置选项
 */
export function IsRequiredPhone(options: {
  description?: string;
  example?: string;
} = {}) {
  return applyDecorators(
    IsString({ message: '必须是字符串类型' }),
    IsNotEmpty({ message: '手机号不能为空' }),
    Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' }),
    ApiProperty({
      description: options.description || '手机号',
      example: options.example || '13800138000',
    }),
  );
}

/**
 * 可选手机号
 * @param options 配置选项
 */
export function IsOptionalPhone(options: {
  description?: string;
  example?: string;
} = {}) {
  return applyDecorators(
    IsOptional(),
    IsString({ message: '必须是字符串类型' }),
    Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' }),
    ApiPropertyOptional({
      description: options.description || '手机号',
      example: options.example || '13800138000',
    }),
  );
}

/**
 * 密码验证（6-20位，包含字母和数字）
 * @param options 配置选项
 */
export function IsPassword(options: {
  description?: string;
  example?: string;
} = {}) {
  return applyDecorators(
    IsString({ message: '必须是字符串类型' }),
    IsNotEmpty({ message: '密码不能为空' }),
    Length(6, 20, { message: '密码长度必须在6-20位之间' }),
    Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,20}$/, {
      message: '密码必须包含字母和数字',
    }),
    ApiProperty({
      description: options.description || '密码',
      example: options.example,
      minLength: 6,
      maxLength: 20,
    }),
  );
}

/**
 * 用户名验证（4-20位，字母数字下划线）
 * @param options 配置选项
 */
export function IsUsername(options: {
  description?: string;
  example?: string;
} = {}) {
  return applyDecorators(
    IsString({ message: '必须是字符串类型' }),
    IsNotEmpty({ message: '用户名不能为空' }),
    Length(4, 20, { message: '用户名长度必须在4-20位之间' }),
    Matches(/^[a-zA-Z0-9_]{4,20}$/, {
      message: '用户名只能包含字母、数字和下划线',
    }),
    ApiProperty({
      description: options.description || '用户名',
      example: options.example || 'username',
      minLength: 4,
      maxLength: 20,
    }),
  );
}

/**
 * IP地址验证
 * @param options 配置选项
 */
export function IsIpAddress(options: {
  description?: string;
  example?: string;
} = {}) {
  return applyDecorators(
    IsString({ message: '必须是字符串类型' }),
    IsNotEmpty({ message: 'IP地址不能为空' }),
    Matches(/^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/, {
      message: 'IP地址格式不正确',
    }),
    ApiProperty({
      description: options.description || 'IP地址',
      example: options.example || '192.168.1.1',
    }),
  );
}

/**
 * 日期验证
 * @param options 配置选项
 */
export function IsRequiredDate(options: {
  description?: string;
  example?: string;
} = {}) {
  return applyDecorators(
    Type(() => Date),
    IsDate({ message: '必须是日期类型' }),
    IsNotEmpty({ message: '日期不能为空' }),
    ApiProperty({
      description: options.description,
      example: options.example,
      type: 'string',
      format: 'date-time',
    }),
  );
}

/**
 * JSON字符串验证
 * @param options 配置选项
 */
export function IsJsonString(options: {
  description?: string;
  example?: string;
} = {}) {
  return applyDecorators(
    IsString({ message: '必须是字符串类型' }),
    IsJSON({ message: '必须是有效的JSON字符串' }),
    ApiProperty({
      description: options.description,
      example: options.example,
    }),
  );
}
