import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { LoggerModule } from "@app/shared/logger";
import { BookingService } from "./booking.service";
import { HallModule } from "../halls/hall.module";
import { SubPaisaModule } from "../subpaisa/subpaisa.module";

@Module({
    controllers: [
        BookingController
    ],
    imports: [
        LoggerModule.register({
            context: BookingModule.name
        }),
        HallModule,
    ],
    exports: [BookingService],
    providers: [BookingService]
})

export class BookingModule { }