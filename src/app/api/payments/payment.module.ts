import { forwardRef, Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { SubPaisaModule } from "../subpaisa/subpaisa.module";
import { LoggerModule } from "@app/shared/logger";
import { PaymentService } from "./payment.service";
import { BookingModule } from "../bookings/booking.module";
import { EnvModule } from "@app/shared/env/env.module";
import { SmsModule } from "../sms/sms.module";

@Module({
    imports: [
        SubPaisaModule,
        forwardRef(() => BookingModule),
        EnvModule,
        LoggerModule.register({ context: PaymentModule.name }),
        SmsModule
    ],
    controllers: [
        PaymentController
    ],
    providers: [
        PaymentService
    ],
    exports: [
        PaymentService
    ]
})
export class PaymentModule { }