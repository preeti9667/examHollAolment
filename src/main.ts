import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { EnvService } from '@app/shared/env';
import { HttpException, HttpStatus, INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { LoggerService } from '@app/shared/logger';
import { API_BASE_PATH } from '@app/api';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CONFIG } from '@app/app.constant';
import { ValidationError } from 'class-validator';
import { TimeoutInterceptor } from '@interceptors/timeout/timeout.interceptor';
import { I18nService } from 'nestjs-i18n';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { CorrelationInterceptor } from '@interceptors/correlation.interceptor';
import { SecuritySchemeType } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import 'newrelic';
class Server {
  constructor(public app: INestApplication) {
    app.enableCors();
    // app.use(helmet({
    //   contentSecurityPolicy: false,
    // }));
    app.setGlobalPrefix(API_BASE_PATH, { exclude: [''] });
    app.enableVersioning({
      type: VersioningType.URI,
    });
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (args: ValidationError[]) => {
          const reasons: { message: string }[] = [];
          (function handle(prefix: string[], errors: ValidationError[]) {
            errors.forEach((error) => {
              if (error.constraints) {
                reasons.push(
                  ...Object.values(error.constraints).map((message) => {
                    const field = prefix.concat(error.property).join('.');
                    return { field, message };
                  }),
                );
              }
              if (error.children?.length) {
                handle([...prefix, error.property], error.children);
              }
            });
          })([], args);
          return new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              error: 'ValidationError',
              message: reasons[0]?.message,
              reasons,
            },
            HttpStatus.BAD_REQUEST,
          );
        },
      }),
    );
    this.filters();
    const correlation = new CorrelationInterceptor();
    correlation.logger = this.#logger;
    app.useGlobalInterceptors(correlation);
    app.useGlobalInterceptors(new TimeoutInterceptor());
  }

  static async bootstrap(): Promise<Server> {
    const app = await NestFactory.create(AppModule);
    // const env = app.get(EnvService);
    app.enableShutdownHooks()
    const server = new Server(app)
    server.swagger();
    return server;
  }

  readonly #env = this.app.get(EnvService);
  readonly #logger = this.app.get(LoggerService);

  swagger() {
    const config = new DocumentBuilder()
      .setTitle(SWAGGER_CONFIG.TITLE)
      .setDescription(SWAGGER_CONFIG.DESCRIPTION)
      .setVersion(SWAGGER_CONFIG.VERSION)
      .addBearerAuth({
        type: SWAGGER_CONFIG.AUTH_SCHEME.type as SecuritySchemeType,
        scheme: SWAGGER_CONFIG.AUTH_SCHEME.scheme,
        bearerFormat: SWAGGER_CONFIG.AUTH_SCHEME.bearerFormat
      },
        SWAGGER_CONFIG.ACCESS_TOKEN)
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup('apis', this.app, document)
  }

  filters() {
    const { httpAdapter } = this.app.get(HttpAdapterHost);
    const filter = new HttpExceptionFilter(httpAdapter);
    filter.i18n = this.app.get(I18nService);
    filter.logger = this.app.get(LoggerService);
    this.app.useGlobalFilters(filter);
  }
  async start() {
    try {
      const port = this.#env.PORT;
      await this.app.listen(port);
      this.#logger.log(`Server is running on ${await this.app.getUrl()}`);
    } catch (err) {
      this.#logger.error('Error : ', err)
    }
  }


}

Server.bootstrap()
  .then((server: Server) => server.start())
  .catch(err => console.log('Error', JSON.stringify(err)))
