import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { LoggerModule } from "@app/shared/logger";
import { BookingService } from "./booking.service";

@Module({
    controllers: [
        BookingController
    ],
    imports: [
        LoggerModule.register({
            context: BookingModule.name
        }),
    ],
    exports: [],
    providers: [BookingService]
})

export class BookingModule { }