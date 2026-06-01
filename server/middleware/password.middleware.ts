import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

function isValidPassword(pw: string): boolean {
  const readPw = process.env.READ_PASSWORD || process.env.ACCESS_PASSWORD || '';
  const editPw = process.env.EDIT_PASSWORD || '';
  if (!readPw && !editPw) return true;
  if (editPw && pw === editPw) return true;
  if (readPw && pw === readPw) return true;
  return false;
}

export function isEditorPassword(pw: string): boolean {
  const editPw = process.env.EDIT_PASSWORD || '';
  if (!editPw) return true;
  return pw === editPw;
}

@Injectable()
export class PasswordMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const readPw = process.env.READ_PASSWORD || process.env.ACCESS_PASSWORD || '';
    const editPw = process.env.EDIT_PASSWORD || '';
    if (!readPw && !editPw) return next();

    const provided =
      (req.headers['x-access-password'] as string | undefined) ?? '';

    if (isValidPassword(provided)) return next();

    res.status(401).json({ error: { message: '密码错误，请刷新页面重新输入' } });
  }
}
