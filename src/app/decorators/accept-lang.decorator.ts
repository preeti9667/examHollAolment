import { SUPPORTED_LANGUAGES } from '@app/app.constant';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AcceptLanguage = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const acceptLanguage = request.headers['accept-language'];

        if (acceptLanguage) {
            const requestedLanguage = acceptLanguage.toLowerCase();
            if (Object.values(SUPPORTED_LANGUAGES).includes(requestedLanguage)) {
                return requestedLanguage;
            } else {
                return SUPPORTED_LANGUAGES.EN;
            }
        } else {
            return SUPPORTED_LANGUAGES.EN;
        }
    },
);
