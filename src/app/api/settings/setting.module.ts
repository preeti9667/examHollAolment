import { Module } from "@nestjs/common";
import { SettingController } from "./setting.controller";
import { SettingService } from "./setting.service";
import { LoggerModule } from "@app/shared/logger";

@Module({
    imports: [
        LoggerModule.register({
            context: SettingModule.name
        })
    ],
    controllers: [
        SettingController
    ],
    providers: [SettingService],
    exports: [SettingService]
})
export class SettingModule { }