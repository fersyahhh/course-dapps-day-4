import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (
          data &&
          typeof data === 'object' &&
          'statusCode' in data &&
          'timestamp' in data
        ) {
          return data as ApiResponseDto<unknown>;
        }

        let statusCode: number = 200;
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const code: unknown = context.switchToHttp().getResponse().statusCode;
          if (typeof code === 'number') {
            statusCode = code;
          }
        } catch {
          // Default
        }

        return {
          statusCode,
          message: 'Success',
          data: data,
          timestamp: new Date().toISOString(),
        } as ApiResponseDto<unknown>;
      }),
    );
  }
}
