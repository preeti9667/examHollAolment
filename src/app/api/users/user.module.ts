import { Module } from "@nestjs/common";
import { LoggerModule } from "@app/shared/logger";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    controllers: [UserController],
    imports: [
        LoggerModule.register({
            context: UserModule.name
        })
    ],
    exports: [],
    providers: [UserService]
})

export class UserModule { };