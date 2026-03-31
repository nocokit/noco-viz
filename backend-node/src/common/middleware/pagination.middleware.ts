import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * 分页参数验证中间件
 */
@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  // 分页参数限制
  private readonly MAX_PAGE_SIZE = 100;
  private readonly DEFAULT_PAGE = 1;
  private readonly DEFAULT_PAGE_SIZE = 20;

  use(req: Request, res: Response, next: NextFunction) {
    // 只处理查询参数中包含page或pageSize的请求
    if (req.query.page || req.query.pageSize || req.query.limit) {
      // 验证并规范化page参数
      if (req.query.page) {
        const page = parseInt(req.query.page as string);
        if (isNaN(page) || page < 1) {
          throw new BadRequestException('page参数必须是大于0的整数');
        }
        req.query.page = page.toString();
      } else {
        req.query.page = this.DEFAULT_PAGE.toString();
      }

      // 验证并规范化pageSize/limit参数
      const pageSizeParam = req.query.pageSize || req.query.limit;
      if (pageSizeParam) {
        const pageSize = parseInt(pageSizeParam as string);
        if (isNaN(pageSize) || pageSize < 1) {
          throw new BadRequestException('pageSize/limit参数必须是大于0的整数');
        }
        if (pageSize > this.MAX_PAGE_SIZE) {
          throw new BadRequestException(
            `pageSize/limit参数不能超过${this.MAX_PAGE_SIZE}`,
          );
        }
        // 统一使用pageSize
        req.query.pageSize = pageSize.toString();
        if (req.query.limit) {
          delete req.query.limit;
        }
      } else {
        req.query.pageSize = this.DEFAULT_PAGE_SIZE.toString();
      }
    }

    next();
  }
}
