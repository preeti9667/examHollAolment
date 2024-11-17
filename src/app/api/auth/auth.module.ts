import { Global, Module } from "@nestjs/common";
import { LoggerModule } from "@app/shared/logger";
import { EnvModule } from "@app/shared/env/env.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { TokenModule } from "../token/token.module";
import { SmsModule } from "../sms/sms.module";

@Global()
@Module({
    imports: [
        LoggerModule.register(
            { context: AuthModule.name }
        ),
        EnvModule,
        JwtModule,
        TokenModule,
        SmsModule,
        EnvModule
    ],
    controllers: [
        AuthController
    ],

    exports: [AuthService],
    providers: [AuthService]
})
export class AuthModule { };