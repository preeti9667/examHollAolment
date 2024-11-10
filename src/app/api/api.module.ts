import { Module } from "@nestjs/common";
import { ApiController } from "./api.controller";
import { ApiService } from "./api.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./users/user.module";
import { TimeSlotModule } from "./time-slots/time-slot.module";
import { HallModule } from "./halls/hall.module";
import { BookingModule } from "./bookings/booking.module";
import { ScheduleModule } from "./schedule/schedule.module";

@Module({
    imports: [
        UserModule,
        AuthModule,
        TimeSlotModule,
        HallModule,
        BookingModule,
        ScheduleModule
    ],
    exports: [],
    controllers: [ApiController],
    providers: [ApiService]
})
export class ApiModule { }