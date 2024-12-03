
import { ApiException } from '@app/api/api.exception';
import { AuthService } from '@app/api/auth/auth.service';
import { IRole } from '@app/api/auth/interfaces/auth-user';
import { TokenService } from '@app/api/token/token.service';
import { IApiType } from '@app/decorators/set-api-data.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountType } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private $auth: AuthService,
    private $reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const authUser = await this.$auth.veryAccessToken(token);
      const apiType = this.$reflector.get('apiMetaData', context.getHandler()) as IApiType;
      if (apiType) {
        if (apiType.onlyAdmin) {
          if (authUser.type !== AccountType.ADMIN) ApiException.unAuthorized('AUTH.NOT_ALLOWED');
          const role = authUser.role as IRole;
          if (!role) throw new UnauthorizedException();
          if (!role?.isActive) throw new UnauthorizedException();
          if (!role.isSuper) {
            const isAccess = role.permissions.find(permission => permission.module === apiType.module)?.actions.includes(apiType.action);
            if (!isAccess)
              ApiException.unAuthorized('AUTH.NOT_PERMITTED');
          }
        }
      } else {
        if (authUser.type !== AccountType.CUSTOMER) ApiException.unAuthorized('AUTH.NOT_ALLOWED');
      }

      request['user'] = authUser;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
