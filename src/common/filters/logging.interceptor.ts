import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const body = req.body;

    this.logger.log(`Incoming Request: ${method} ${url} Body: ${JSON.stringify(body)}`);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `Response: ${method} ${url} Status: ${context.switchToHttp().getResponse().statusCode} | ${responseTime}ms`,
          );
        },
        error: (err) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `Error Response: ${method} ${url} Status: ${
              context.switchToHttp().getResponse().statusCode
            } | ${responseTime}ms | Message: ${err.message}`,
            err.stack,
          );
        },
      }),
    );
  }
}
