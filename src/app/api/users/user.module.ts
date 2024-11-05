import { Module } from "@nestjs/common";
import { UserAdminService, UserService } from "./services";
import { UserAdminController, UserController } from "./controllers";
import { LoggerModule } from "@app/shared/logger";

@Module({
    controllers: [UserAdminController, UserController],
    imports: [
        LoggerModule.register({
            context: UserModule.name
        })
    ],
    exports: [],
    providers: [UserService, UserAdminService]
})

export class UserModule { };