import { Module, OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ensureTable, getDb } from './db';

@Module({
  controllers: [ContentController],
})
export class ContentModule implements OnModuleInit {
  private readonly logger = new Logger(ContentModule.name);

  async onModuleInit() {
    if (!getDb()) {
      this.logger.warn(
        'DATABASE_URL not set — content API will return 503. Set DATABASE_URL to enable persistent editing.',
      );
      return;
    }
    await ensureTable();
    this.logger.log('Content module initialized with Postgres');
  }
}
