import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';

@Controller('api/auth')
export class AuthController {
  @Post('verify')
  verify(@Body() body: { password?: string }): { ok: true } {
    const expected = process.env.ACCESS_PASSWORD ?? '';
    // If no password is set, always pass (local dev / Railway without ACCESS_PASSWORD)
    if (!expected) return { ok: true };

    if (body?.password !== expected) {
      throw new UnauthorizedException('密码错误');
    }
    return { ok: true };
  }
}
