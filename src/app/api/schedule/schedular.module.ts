import { LoggerModule } from "@app/shared/logger";
import { Module } from "@nestjs/common";
import { BookingModule } from "../bookings/booking.module";
import { ScheduleModule } from '@nestjs/schedule';
import { SchedularController } from "./schedular.controller";
import { SchedularService } from "./schedular.service";

@Module({
    controllers: [
        SchedularController,
    ],
    imports: [
        LoggerModule.register({ context: SchedularModule.name }),
        ScheduleModule.forRoot(),
        BookingModule
    ],
    providers: [SchedularService]
})
export class SchedularModule { }