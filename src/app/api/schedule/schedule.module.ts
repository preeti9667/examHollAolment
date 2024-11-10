import { LoggerModule } from "@app/shared/logger";
import { Module } from "@nestjs/common";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";
import { BookingModule } from "../bookings/booking.module";

@Module({
    controllers: [
        ScheduleController,
    ],
    imports: [
        LoggerModule.register({ context: ScheduleModule.name }),
        BookingModule
    ],
    providers: [ScheduleService]
})
export class ScheduleModule { }