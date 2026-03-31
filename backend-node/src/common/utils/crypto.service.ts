import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

/**
 * 加密服务
 * 提供密码加密、验证等功能
 */
@Injectable()
export class CryptoService {
  private readonly saltRounds = 10;

  /**
   * 加密密码
   * @param password 明文密码
   * @returns 加密后的密码
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * 验证密码
   * @param password 明文密码
   * @param hashedPassword 加密后的密码
   * @returns 是否匹配
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * 生成随机盐
   * @param rounds 加密轮数
   * @returns 盐值
   */
  async generateSalt(rounds: number = this.saltRounds): Promise<string> {
    return bcrypt.genSalt(rounds);
  }

  /**
   * 使用指定盐加密密码
   * @param password 明文密码
   * @param salt 盐值
   * @returns 加密后的密码
   */
  async hashPasswordWithSalt(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  /**
   * 生成随机字符串
   * @param length 长度
   * @returns 随机字符串
   */
  generateRandomString(length: number = 32): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 生成随机数字字符串
   * @param length 长度
   * @returns 随机数字字符串
   */
  generateRandomNumber(length: number = 6): string {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 生成UUID
   * @returns UUID字符串
   */
  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  /**
   * Base64 编码
   * @param str 原始字符串
   * @returns Base64编码后的字符串
   */
  base64Encode(str: string): string {
    return Buffer.from(str).toString('base64');
  }

  /**
   * Base64 解码
   * @param str Base64编码的字符串
   * @returns 解码后的字符串
   */
  base64Decode(str: string): string {
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  /**
   * MD5 哈希
   * @param str 原始字符串
   * @returns MD5哈希值
   */
  md5Hash(str: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(str).digest('hex');
  }

  /**
   * SHA256 哈希
   * @param str 原始字符串
   * @returns SHA256哈希值
   */
  sha256Hash(str: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(str).digest('hex');
  }
}

/**
 * 密码工具函数（无需注入服务）
 */
export class PasswordUtils {
  /**
   * 快速加密密码
   * @param password 明文密码
   * @returns 加密后的密码
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * 快速验证密码
   * @param password 明文密码
   * @param hashedPassword 加密后的密码
   * @returns 是否匹配
   */
  static async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * 验证密码强度
   * @param password 密码
   * @returns 强度等级 (0-4)
   */
  static checkStrength(password: string): number {
    let strength = 0;

    // 长度检查
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // 包含小写字母
    if (/[a-z]/.test(password)) strength++;

    // 包含大写字母
    if (/[A-Z]/.test(password)) strength++;

    // 包含数字
    if (/\d/.test(password)) strength++;

    // 包含特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    return Math.min(strength, 4);
  }

  /**
   * 生成随机密码
   * @param length 长度
   * @param includeSpecialChars 是否包含特殊字符
   * @returns 随机密码
   */
  static generatePassword(
    length: number = 12,
    includeSpecialChars: boolean = true,
  ): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = lowercase + uppercase + numbers;
    if (includeSpecialChars) {
      chars += special;
    }

    let password = '';
    // 确保至少包含一个小写、大写和数字
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    if (includeSpecialChars) {
      password += special[Math.floor(Math.random() * special.length)];
    }

    // 填充剩余长度
    for (let i = password.length; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }

    // 打乱顺序
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
}
