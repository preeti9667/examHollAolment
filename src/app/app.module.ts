import { MiddlewareConsumer, Module, NestModule, OnApplicationShutdown } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from '@app/shared/env/env.module';
import { LoggerModule } from '@app/shared/logger/logger.module';
import { ApiModule } from '@app/api';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { ClsModule } from 'nestjs-cls';
import { PrismaModule } from './databases/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '@interceptors/transform/transform.interceptor';
import { NewrelicMiddleware } from './middleware';


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
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    }
  ],

})
export class AppModule implements NestModule, OnApplicationShutdown {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(NewrelicMiddleware).forRoutes('*');
  }

  onApplicationShutdown(signal?: string) {
    console.log('Application closed');
  }
}
