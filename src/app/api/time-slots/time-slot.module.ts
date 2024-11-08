import { Module } from "@nestjs/common";
import { TimeSlotService } from "./time-slot.service";
import { LoggerModule } from "@app/shared/logger";
import { TimeSlotController } from "./time-slot.controller";

@Module({
    controllers: [TimeSlotController],
    imports: [
        LoggerModule.register({ context: TimeSlotModule.name })
    ],
    exports: [],
    providers: [TimeSlotService]
})
export class TimeSlotModule { }