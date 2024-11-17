import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { SubPaisaModule } from "../subpaisa/subpaisa.module";
import { LoggerModule } from "@app/shared/logger";
import { PaymentService } from "./payment.service";
import { BookingModule } from "../bookings/booking.module";
import { EnvModule } from "@app/shared/env/env.module";

@Module({
    imports: [
        SubPaisaModule,
        BookingModule,
        EnvModule,
        LoggerModule.register({ context: PaymentModule.name }),
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