import { Module } from "@nestjs/common";
import { LoggerModule } from "@app/shared/logger";
import { EnvModule } from "@app/shared/env/env.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        LoggerModule.register(
            { context: AuthModule.name }
        ),
        EnvModule
    ],
    controllers: [
        AuthController
    ],

    exports: [],
    providers: [AuthService]
})
export class AuthModule { };