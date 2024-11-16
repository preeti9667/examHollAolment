import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { InitPaymentBodyDto } from "./dto/init-payment.dto";
import { BookingStatus } from "../bookings/booking.constant";
import { ApiException } from "../api.exception";
import { SubPaisaService } from "../subpaisa/subpaisa.service";
import { PaymentStatus } from "./payment.constant";

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
            where: {
                id: bookingId,
                status: BookingStatus.AwaitingForPayment
            }
        });

        if (!booking) ApiException.badData('PAYMENT.INVALID_BOOKING_ID');

        const transactionId = `tx_${this.$subPaisa.randomStr(20, "12345abcdefghijkl1234567")}`;

        await this.$prisma.payment.create({
            data: {
                bookingId,
                transactionId,
                status: PaymentStatus.Pending,
                amount: booking.totalCost
            }
        });

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


    async paymentResponse(body: any) {
        this.$logger.log(`Body response : ${JSON.stringify(body)}`);
        const encData = body.encResponse || body.encData || body?.data?.encData;
        if (!encData) ApiException.badData('PAYMENT.ENC_DATA_MISSING');
        const decrypted = await this.$subPaisa.paymentHandler(encData);
        this.$logger.log(JSON.stringify(decrypted, undefined, 2));
        const decryptedResponse = decrypted.decryptedResponse.split('&');
        let decryptedResponseObj = {};
        decryptedResponse.forEach(e => {
            const [key, value] = e.split('=');
            decryptedResponseObj[key] = value;
        })
        console.log(decryptedResponseObj);

        const dataString = JSON.stringify(decrypted.decryptedResponse);
        return dataString;
    }
}