import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';

export type AuthRole = 'viewer' | 'editor';

@Controller('api/auth')
export class AuthController {
  @Post('verify')
  verify(@Body() body: { password?: string }): { ok: true; role: AuthRole } {
    const readPw = process.env.READ_PASSWORD || process.env.ACCESS_PASSWORD || '';
    const editPw = process.env.EDIT_PASSWORD || '';

    if (!readPw && !editPw) return { ok: true, role: 'editor' };

    const pw = body?.password ?? '';

    if (editPw && pw === editPw) return { ok: true, role: 'editor' };
    if (readPw && pw === readPw) return { ok: true, role: 'viewer' };

    throw new UnauthorizedException('密码错误');
  }
}
