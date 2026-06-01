import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  Req,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { Request } from 'express';
import { getDb, getContent, setContent } from './db';
import { isEditorPassword } from '../../middleware/password.middleware';

function requireEditor(req: Request) {
  const pw = (req.headers['x-access-password'] as string) ?? '';
  if (!isEditorPassword(pw)) {
    throw new ForbiddenException('需要编辑权限');
  }
}

@Controller('api/content')
export class ContentController {
  @Get(':key')
  async read(@Param('key') key: string) {
    if (!getDb()) throw new ServiceUnavailableException('数据库未配置');
    const data = await getContent(key);
    if (data === null) throw new NotFoundException(`内容 "${key}" 不存在`);
    return { key, data };
  }

  @Put(':key')
  async write(
    @Param('key') key: string,
    @Body() body: { data: unknown },
    @Req() req: Request,
  ) {
    requireEditor(req);
    if (!getDb()) throw new ServiceUnavailableException('数据库未配置');
    await setContent(key, body.data);
    return { ok: true, key };
  }

  @Post(':key/seed')
  async seed(
    @Param('key') key: string,
    @Body() body: { data: unknown },
    @Req() req: Request,
  ) {
    requireEditor(req);
    if (!getDb()) throw new ServiceUnavailableException('数据库未配置');
    await setContent(key, body.data);
    return { ok: true, key, action: 'seeded' };
  }
}
