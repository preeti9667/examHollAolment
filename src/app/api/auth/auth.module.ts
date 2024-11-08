import { Module } from "@nestjs/common";
import { LoggerModule } from "@app/shared/logger";
import { EnvModule } from "@app/shared/env/env.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { TokenModule } from "../token/token.module";

@Module({
    imports: [
        LoggerModule.register(
            { context: AuthModule.name }
        ),
        EnvModule,
        JwtModule,
        TokenModule
    ],
    controllers: [
        AuthController
    ],

    exports: [],
    providers: [AuthService]
})
export class AuthModule { };