import { IAuthUser } from '@app/api/auth/interfaces/auth-user';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as IAuthUser;
    },
);
