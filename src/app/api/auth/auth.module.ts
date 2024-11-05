import { Module } from "@nestjs/common";
import { AuthAdminController, AuthController } from "./controllers";
import { AuthService } from "./services";
import { LoggerModule } from "@app/shared/logger";
import { EnvModule } from "@app/shared/env/env.module";

@Module({
    imports: [
        LoggerModule.register(
            { context: AuthModule.name }
        ),
        EnvModule
    ],
    controllers: [
        AuthController,
        AuthAdminController
    ],

    exports: [],
    providers: [AuthService]
})
export class AuthModule { };