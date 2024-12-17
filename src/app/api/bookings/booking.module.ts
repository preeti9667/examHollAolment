import { forwardRef, Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { LoggerModule } from "@app/shared/logger";
import { BookingService } from "./booking.service";
import { HallModule } from "../halls/hall.module";
import { SubPaisaModule } from "../subpaisa/subpaisa.module";
import { SmsModule } from "../sms/sms.module";
import { PaymentModule } from "../payments/payment.module";
import { SettingModule } from "../settings/setting.module";

@Module({
    controllers: [
        BookingController
    ],
    imports: [
        LoggerModule.register({
            context: BookingModule.name
        }),
        HallModule,
        SettingModule,
        SmsModule,
        forwardRef(() => PaymentModule)

    ],
    exports: [BookingService],
    providers: [BookingService]
})

export class BookingModule { }