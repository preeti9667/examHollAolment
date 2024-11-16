import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { InitPaymentBodyDto } from "./dto/init-payment.dto";
import { BookingStatus } from "../bookings/booking.constant";
import { ApiException } from "../api.exception";
import { SubPaisaService } from "../subpaisa/subpaisa.service";
import { PaymentStatus } from "./payment.constant";
import { SubPaisaPaymentStatus } from "../subpaisa/subpaisa.contant";
import { dateStringToUtc, dsToUTC } from "src/utils";
import { BookingService } from "../bookings/booking.service";
import { EnvService } from "@app/shared/env";

@Injectable()
export class PaymentService {

    constructor(
        private $logger: LoggerService,
        private $prisma: PrismaService,
        private $subPaisa: SubPaisaService,
        private $booking: BookingService,
        private $env: EnvService
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
        const decryptedResponse = decrypted.decryptedResponse.split('&');
        let decryptedResponseObj: any = {};
        decryptedResponse.forEach(e => {
            const [key, value] = e.split('=');
            decryptedResponseObj[key] = value;
        });
        const payment = await this.$prisma.payment.findFirst({
            where: {
                transactionId: decryptedResponseObj.clientTxnId
            }
        });

        const paymentStatus = this.paymentStatus(decryptedResponseObj.statusCode);

        await this.$prisma.payment.update({
            where: { id: payment.id },
            data: {
                sabpaisaTxnId: decryptedResponseObj.sabpaisaTxnId,
                status: paymentStatus,
                paidAmount: Number(decryptedResponseObj.paidAmount),
                paymentMode: decryptedResponseObj.paymentMode,
                currency: decryptedResponseObj.amountType,
                transDate: dsToUTC(decryptedResponseObj.transDate),
                transaction: {
                    clientCode: decryptedResponseObj.clientCode,
                    bankName: decryptedResponseObj.bankName,
                    statusCode: decryptedResponseObj.statusCode,
                    challanNumber: decryptedResponseObj.challanNumber,
                    sabpaisaMessage: decryptedResponseObj.sabpaisaMessage,
                    bankMessage: decryptedResponseObj.bankMessage,
                    bankErrorCode: decryptedResponseObj.bankErrorCode,
                    sabpaisaErrorCode: decryptedResponseObj.sabpaisaErrorCode,
                    bankTxnId: decryptedResponseObj.bankTxnId,
                }
            }
        })
        await this.$booking.handleBookingPaymentStatus(
            payment.bookingId,
            paymentStatus,
            decryptedResponseObj.paymentMode
        );
        const dataString = JSON.stringify(decrypted.decryptedResponse);
        return { dataString, redirectUrl: this.$env.REDIRECT_URL_PAYMENT };
    }


    private paymentStatus(statusCode: string): PaymentStatus {
        let status = PaymentStatus.Success;
        switch (statusCode) {
            case SubPaisaPaymentStatus.Success:
                status = PaymentStatus.Success
                break;
            case SubPaisaPaymentStatus.Aborted:
                status = PaymentStatus.Aborted
                break;
            case SubPaisaPaymentStatus.Failed:
                status = PaymentStatus.Failed
                break;
            case SubPaisaPaymentStatus.ChallanSpecific:
                status = PaymentStatus.ChallanSpecific
                break;
            case SubPaisaPaymentStatus.NotFound:
                status = PaymentStatus.NotFound
                break;
            case SubPaisaPaymentStatus.UnKnownResponse:
                status = PaymentStatus.Pending
                break;
            case SubPaisaPaymentStatus.NotCompleted:
                status = PaymentStatus.NotCompleted
                break;
            default:
                status = PaymentStatus.Failed
                break;
        }
        return status;

    }
}