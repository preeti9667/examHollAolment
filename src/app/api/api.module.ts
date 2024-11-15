import { Module } from "@nestjs/common";
import { ApiController } from "./api.controller";
import { ApiService } from "./api.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./users/user.module";
import { TimeSlotModule } from "./time-slots/time-slot.module";
import { HallModule } from "./halls/hall.module";
import { BookingModule } from "./bookings/booking.module";
import { AddOnsModule } from "./add-ons/add-ons.module";
import { SchedularModule } from "./schedule/schedular.module";
import { PaymentModule } from "./payments/payment.module";

@Module({
        imports: [
                UserModule,
                AuthModule,
                TimeSlotModule,
                HallModule,
                BookingModule,
                AddOnsModule,
                SchedularModule,
                PaymentModule
        ],
        exports: [],
        controllers: [ApiController],
        providers: [ApiService]
})
export class ApiModule { }