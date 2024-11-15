import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { SubPaisaModule } from "../subpaisa/subpaisa.module";
import { LoggerModule } from "@app/shared/logger";
import { PaymentService } from "./payment.service";

@Module({
    imports: [
        SubPaisaModule,
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