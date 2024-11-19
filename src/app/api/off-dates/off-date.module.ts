import { Module } from "@nestjs/common";
import { OffDateController } from "./off-date.controller";
import { LoggerModule } from "@app/shared/logger";
import { OffDateService } from "./off-date.service";

@Module({
    controllers: [OffDateController],
    imports: [
        LoggerModule.register({
            context: OffDateModule.name,
        })
    ],
    providers: [OffDateService],
    exports: [OffDateService]
})

export class OffDateModule { }