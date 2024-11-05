import { Module } from "@nestjs/common";
import { AuthAdminController, AuthController } from "./controllers";
import { AuthService } from "./services";
import { LoggerModule } from "@app/shared/logger";

@Module({
    imports: [
        LoggerModule.register(
            { context: AuthModule.name }
        )
    ],
    controllers: [
        AuthController,
        AuthAdminController
    ],
    exports: [],
    providers: [AuthService]
})
export class AuthModule { };