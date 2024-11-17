import { LoggerModule } from "@app/shared/logger";
import { Module } from "@nestjs/common";
import { SmsService } from "./sms.service";
import { EnvModule } from "@app/shared/env/env.module";

@Module({
    imports: [
        LoggerModule.register({
            context: SmsModule.name
        }),
        EnvModule
    ],
    providers: [SmsService],
    exports: [SmsService],
})

export class SmsModule { }