import { LoggerModule } from "@app/shared/logger";
import { Module } from "@nestjs/common";
import { HallController } from "./hall.controller";
import { HallService } from "./hall.service";

@Module({
    imports: [
        LoggerModule.register({ context: HallModule.name }),
    ],
    controllers: [
        HallController
    ],
    providers: [
        HallService
    ],
    exports: [
        HallService
    ]
})
export class HallModule { }