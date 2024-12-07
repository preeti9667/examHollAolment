import { Module } from "@nestjs/common";
import { LoggerModule } from "@app/shared/logger";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { EnvModule } from "@app/shared/env/env.module";
import { SmsModule } from "../sms/sms.module";

@Module({
    controllers: [UserController],
    imports: [
        LoggerModule.register({
            context: UserModule.name
        }),
        EnvModule,
        SmsModule
    ],
    exports: [],
    providers: [UserService]
})

export class UserModule { };