import { APP_FILTER } from '@nestjs/core';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { AiModule } from './modules/ai/ai.module';
import { ViewModule } from './modules/view/view.module';
import { AuthModule } from './modules/auth/auth.module';
import { PasswordMiddleware } from './middleware/password.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AiModule,
    AuthModule,
    ViewModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Protect all AI endpoints with password middleware.
    // /api/auth/verify is intentionally excluded (that's the login endpoint itself).
    consumer
      .apply(PasswordMiddleware)
      .forRoutes('/api/ai');
  }
}
