import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from '@app/shared/env/env.module';
import { LoggerModule } from '@app/shared/logger/logger.module';
import { ApiModule } from '@app/api';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { ClsModule } from 'nestjs-cls';
import { PrismaModule } from './databases/prisma/prisma.module';
import { HttpsRedirectMiddleware } from './middleware/https-redirect.middleware'; // Import the middleware

@Module({
  imports: [
    EnvModule,
    LoggerModule.register({
      context: AppModule.name
    }),
    ApiModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.resolve(__dirname, '../../i18n'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    ClsModule.forRoot({
      global: true,
      interceptor: {
        mount: true,
        generateId: true,
      },
    }),
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpsRedirectMiddleware) // Apply the middleware
      .forRoutes('*'); // Apply to all routes
  }
}
