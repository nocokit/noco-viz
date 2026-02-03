import { BadRequestException } from '@nestjs/common';

/**
 * 文件验证工具类
 */
export class FileValidator {
  // 允许的图片MIME类型
  private static readonly IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];

  // 允许的视频MIME类型
  private static readonly VIDEO_MIME_TYPES = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
  ];

  // 允许的文档MIME类型
  private static readonly DOCUMENT_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
  ];

  // 允许的Excel MIME类型
  private static readonly EXCEL_MIME_TYPES = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ];

  // 允许的ZIP MIME类型
  private static readonly ZIP_MIME_TYPES = [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-zip',
  ];

  // 文件大小限制（字节）
  private static readonly MAX_FILE_SIZE = {
    image: 10 * 1024 * 1024,      // 10MB
    video: 500 * 1024 * 1024,     // 500MB
    document: 20 * 1024 * 1024,   // 20MB
    excel: 10 * 1024 * 1024,      // 10MB
    zip: 50 * 1024 * 1024,        // 50MB
    default: 10 * 1024 * 1024,    // 10MB
  };

  /**
   * 验证图片文件
   */
  static validateImage(file: Express.Multer.File): void {
    this.validateFile(file, this.IMAGE_MIME_TYPES, this.MAX_FILE_SIZE.image, '图片');
  }

  /**
   * 验证视频文件
   */
  static validateVideo(file: Express.Multer.File): void {
    this.validateFile(file, this.VIDEO_MIME_TYPES, this.MAX_FILE_SIZE.video, '视频');
  }

  /**
   * 验证文档文件
   */
  static validateDocument(file: Express.Multer.File): void {
    this.validateFile(file, this.DOCUMENT_MIME_TYPES, this.MAX_FILE_SIZE.document, '文档');
  }

  /**
   * 验证Excel文件
   */
  static validateExcel(file: Express.Multer.File): void {
    this.validateFile(file, this.EXCEL_MIME_TYPES, this.MAX_FILE_SIZE.excel, 'Excel');
  }

  /**
   * 验证ZIP文件
   */
  static validateZip(file: Express.Multer.File): void {
    this.validateFile(file, this.ZIP_MIME_TYPES, this.MAX_FILE_SIZE.zip, 'ZIP');
  }

  /**
   * 验证媒体文件（图片、视频）
   */
  static validateMedia(file: Express.Multer.File): void {
    const allowedTypes = [...this.IMAGE_MIME_TYPES, ...this.VIDEO_MIME_TYPES];
    const maxSize = Math.max(this.MAX_FILE_SIZE.image, this.MAX_FILE_SIZE.video);
    this.validateFile(file, allowedTypes, maxSize, '媒体');
  }

  /**
   * 通用文件验证
   */
  private static validateFile(
    file: Express.Multer.File,
    allowedMimeTypes: string[],
    maxSize: number,
    fileTypeName: string,
  ): void {
    if (!file) {
      throw new BadRequestException('未提供文件');
    }

    // 验证文件大小
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      throw new BadRequestException(
        `${fileTypeName}文件大小超过限制，最大允许${maxSizeMB}MB`,
      );
    }

    // 验证MIME类型
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `不支持的${fileTypeName}文件类型: ${file.mimetype}`,
      );
    }

    // 验证文件扩展名
    const extension = this.getFileExtension(file.originalname);
    const allowedExtensions = this.getMimeTypeExtensions(allowedMimeTypes);

    if (!allowedExtensions.includes(extension.toLowerCase())) {
      throw new BadRequestException(
        `不支持的文件扩展名: ${extension}`,
      );
    }

    // 检查文件名安全性
    this.validateFileName(file.originalname);
  }

  /**
   * 获取文件扩展名
   */
  private static getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return '';
    }
    return filename.substring(lastDotIndex + 1);
  }

  /**
   * 根据MIME类型获取允许的扩展名
   */
  private static getMimeTypeExtensions(mimeTypes: string[]): string[] {
    const extensions = [];
    for (const mimeType of mimeTypes) {
      switch (mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
          extensions.push('jpg', 'jpeg');
          break;
        case 'image/png':
          extensions.push('png');
          break;
        case 'image/gif':
          extensions.push('gif');
          break;
        case 'image/webp':
          extensions.push('webp');
          break;
        case 'image/svg+xml':
          extensions.push('svg');
          break;
        case 'video/mp4':
          extensions.push('mp4');
          break;
        case 'video/mpeg':
          extensions.push('mpeg', 'mpg');
          break;
        case 'video/quicktime':
          extensions.push('mov');
          break;
        case 'video/x-msvideo':
          extensions.push('avi');
          break;
        case 'video/webm':
          extensions.push('webm');
          break;
        case 'application/pdf':
          extensions.push('pdf');
          break;
        case 'application/msword':
          extensions.push('doc');
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          extensions.push('docx');
          break;
        case 'application/vnd.ms-excel':
          extensions.push('xls');
          break;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          extensions.push('xlsx');
          break;
        case 'application/vnd.ms-powerpoint':
          extensions.push('ppt');
          break;
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          extensions.push('pptx');
          break;
        case 'text/plain':
          extensions.push('txt');
          break;
        case 'text/csv':
          extensions.push('csv');
          break;
        case 'application/zip':
        case 'application/x-zip-compressed':
        case 'application/x-zip':
          extensions.push('zip');
          break;
      }
    }
    return extensions;
  }

  /**
   * 验证文件名安全性
   */
  private static validateFileName(filename: string): void {
    // 检查文件名长度
    if (filename.length > 255) {
      throw new BadRequestException('文件名过长');
    }

    // 检查危险字符
    const dangerousChars = ['..', '/', '\\', '<', '>', ':', '"', '|', '?', '*', '\0'];
    for (const char of dangerousChars) {
      if (filename.includes(char)) {
        throw new BadRequestException('文件名包含非法字符');
      }
    }

    // 检查文件名是否为空
    if (!filename || filename.trim().length === 0) {
      throw new BadRequestException('文件名不能为空');
    }
  }
}
