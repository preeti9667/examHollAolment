import { LoggerModule } from "@app/shared/logger";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TokenService } from "./token.service";
import { EnvModule } from "@app/shared/env/env.module";

@Module({
    imports: [
        JwtModule,
        LoggerModule.register({
            context: TokenModule.name
        }),
        EnvModule
    ],
    exports: [TokenService],
    providers: [TokenService]
})
export class TokenModule { }