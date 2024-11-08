import { EnvService } from "@app/shared/env";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
    constructor(
        private $jwt: JwtService,
        private $env: EnvService
    ) { }


    async createAccessToken(payload: object): Promise<string> {
        return await this.$jwt.signAsync(payload, {
            secret: this.$env.SECRETS_AUTH_TOKEN,
            privateKey: this.$env.SECRETS_PRIVATE_KEY,
            expiresIn: '1d'
        });
    }

    async decodeToken(token: string) {
        const payload = await this.$jwt.verifyAsync(
            token,
            {
                secret: this.$env.SECRETS_AUTH_TOKEN
            }
        );
        return payload;
    }
}