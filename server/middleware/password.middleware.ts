import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD ?? '';

@Injectable()
export class PasswordMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // If no password is configured, skip auth (local dev)
    if (!ACCESS_PASSWORD) return next();

    const provided =
      (req.headers['x-access-password'] as string | undefined) ?? '';

    if (provided === ACCESS_PASSWORD) return next();

    res.status(401).json({ error: { message: '密码错误，请刷新页面重新输入' } });
  }
}
