import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { InitPaymentBodyDto } from "./dto/init-payment.dto";
import { BookingStatus } from "../bookings/booking.constant";
import { ApiException } from "../api.exception";
import { SubPaisaService } from "../subpaisa/subpaisa.service";

@Injectable()
export class PaymentService {

    constructor(
        private $logger: LoggerService,
        private $prisma: PrismaService,
        private $subPaisa: SubPaisaService
    ) { }

    async initPayment(payload: InitPaymentBodyDto) {
        const { bookingId } = payload;

        const booking = await this.$prisma.booking.findFirst({
            where: { id: bookingId, status: BookingStatus.AwaitingForPayment }
        });

        if (!booking) ApiException.badData('PAYMENT.INVALID_BOOKING_ID');

        const transactionId = this.$subPaisa.randomStr(20, "12345abcdefghijkl");

        const res = this.$subPaisa.initPaymentRequest({
            orderId: booking.id,
            payerName: booking.applicantName,
            payerEmail: booking.contact['email'],
            payerMobile: booking.contact['phoneNumber'],
            amount: booking.totalCost,
            transactionId
        });

        this.$logger.log(`payment initiated for booking : ${booking} that transaction id is '${transactionId}'`);
        return res;
    }
}