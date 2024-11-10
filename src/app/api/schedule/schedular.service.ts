import { Injectable } from "@nestjs/common";
import { BookingService } from "../bookings/booking.service";

@Injectable()
export class SchedularService {

    constructor(
        private $booking: BookingService
    ) {

    }
    async bookingPayment() {
        this.$booking.handleAwaitingForPaymentBooking();
    }
}