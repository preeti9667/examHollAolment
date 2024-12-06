import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { ConsoleLogger, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InitPaymentBodyDto } from "./dto/init-payment.dto";
import { BookingStatus } from "../bookings/booking.constant";
import { ApiException } from "../api.exception";
import { SubPaisaService } from "../subpaisa/subpaisa.service";
import { PaymentRefundMethod, PaymentRefundStatus, PaymentRefundType, PaymentStatus } from "./payment.constant";
import { SubPaisaPaymentStatus } from "../subpaisa/subpaisa.contant";
import { dateDifferenceInMinutes, dsToUTC, OpenId, utcToDateString, UtcToDateString } from "src/utils";
import { BookingService } from "../bookings/booking.service";
import { EnvService } from "@app/shared/env";
import { logger } from "nestjs-i18n";
import { SmsService } from "../sms/sms.service";
import { SMS_TEMPLATE } from "../sms/sms.constant";
import { RefundRequestPayloadDto } from "./dto/refund-request.dto";
import { RefundListQueryDto } from "./dto/refund-list.dto";
import { RefundStatusPayloadDto } from "./dto/refund-status.dto";

@Injectable()
export class PaymentService {

    constructor(
        private $logger: LoggerService,
        private $prisma: PrismaService,
        private $subPaisa: SubPaisaService,
        @Inject(forwardRef(() => BookingService))
        private $booking: BookingService,
        private $env: EnvService,
        private $sms: SmsService
    ) {
    }



    private async generateTransactionId(): Promise<string> {
        const todayTransactionCount = await this.$prisma.payment.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });
        const dateString = utcToDateString(new Date());
        const transactionId = `TXN${dateString.split('-').join('')}${(todayTransactionCount + 1).toString().padStart(3, '0')}`;
        if (await this.$prisma.payment.findFirst({ where: { transactionId } }))
            return this.generateTransactionId();
        return transactionId;

    }

    private async generatePaymentRefundId(): Promise<string> {
        const todayRefundCount = await this.$prisma.paymentRefund.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });
        const dateString = utcToDateString(new Date());
        const displayId = `RF${dateString.split('-').join('')}${(todayRefundCount + 1).toString().padStart(3, '0')}`;
        if (await this.$prisma.paymentRefund.findFirst({ where: { displayId } }))
            return this.generatePaymentRefundId();
        return displayId;

    }

    async initPayment(payload: InitPaymentBodyDto) {
        const { bookingId } = payload;

        const booking = await this.$prisma.booking.findFirst({
            where: {
                id: bookingId,
                status: BookingStatus.AwaitingForPayment
            }
        });

        if (!booking) ApiException.badData('PAYMENT.INVALID_BOOKING_ID');

        const transactionId = await this.generateTransactionId();

        await this.$prisma.payment.create({
            data: {
                bookingId,
                transactionId,
                status: PaymentStatus.Pending,
                amount: booking.totalCost
            }
        });

        const res = await this.$subPaisa.initPaymentRequest({
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

    async page(payload: InitPaymentBodyDto) {
        const dataString = payload.bookingId;
        const decrypted = this.$subPaisa.decrypt(dataString);
        const [createdAt, bookingId, totalCost] = decrypted.split('_');
        const linkDiff = dateDifferenceInMinutes(new Date(createdAt), new Date());
        if (linkDiff > 25) ApiException.badData('PAYMENT.LINK_EXPIRED');

        const booking = await this.$prisma.booking.findFirst({
            where: {
                id: bookingId,
                status: BookingStatus.AwaitingForPayment
            }
        });
        if (!booking) ApiException.badData('PAYMENT.INVALID_BOOKING_ID');
        const transactionId = await this.generateTransactionId();
        await this.$prisma.payment.create({
            data: {
                bookingId,
                transactionId,
                status: PaymentStatus.Pending,
                amount: booking.totalCost
            }
        });

        const res = await this.$subPaisa.initPaymentRequest({
            orderId: booking.id,
            payerName: booking.applicantName,
            payerEmail: booking.contact['email'],
            payerMobile: booking.contact['phoneNumber'],
            amount: booking.totalCost,
            transactionId
        }, true);

        let html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>SubPaisa Payment Gateway</title>
                </head>
                <body>
                    <h2>Redirecting to SubPaisa Payment Gateway...</h2>
                    <form
                    id="paymentForm"
                    action="$spURL"
                    method="POST"
                    >
                    <input
                        type="hidden"
                        name="encData"
                        value="$encData"
                    />
                    <input type="hidden" name="clientCode" value="$clientCode" />
                    </form>

                    <script type="text/javascript">
                    document.getElementById("paymentForm").submit();
                    </script>
                </body>
                </html>
            `;

        html = html.replace('$spURL', res.spURL)
            .replace('$encData', res.encData)
            .replace('$clientCode', res.clientCode);


        return html;
    }


    async paymentLink(bookingId: string) {
        const booking = await this.$prisma.booking.findFirst({
            where: {
                id: bookingId,
                status: BookingStatus.AwaitingForPayment
            }
        });
        if (!booking) ApiException.badData('PAYMENT.INVALID_BOOKING_ID');
        if (booking.status !== BookingStatus.AwaitingForPayment) {
            ApiException.badData('PAYMENT.BOOKING_NOT_AVAILABLE');
        }
        const param = `${new Date().toISOString()}_${booking.id}_${booking.totalCost}`;
        const encryptedParam = await this.$subPaisa.encrypt(param);
        const encryptedParamWithoutSlash = encodeURIComponent(encryptedParam);
        const link = `${this.$env.PAYMENT_LINK_BASE_URL}/api/v1/payments/page/${encryptedParamWithoutSlash}`;
        await this.$prisma.booking.update({
            where: { id: bookingId },
            data: { paymentLink: link }
        })
        return link;
    }

    async paymentResponse(body: any) {
        this.$logger.log(`Body response : ${JSON.stringify(body)}`);
        const encData = body.encResponse || body.encData || body?.data?.encData;
        if (!encData) {
            this.$logger.error(`Missing encData in request body`, JSON.stringify(body));
            throw new Error("Payment failed due to missing encData from subpaisa");
        };
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

        let redirectUrl = this.$env.REDIRECT_URL_PAYMENT;
        const udf2 = decryptedResponseObj.udf2;

        if (udf2 === 'true') {
            redirectUrl = this.$env.PAYMENT_LINK_REDIRECT_URL;
        }

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
        const booking = await this.$booking.handleBookingPaymentStatus(
            payment.bookingId,
            paymentStatus,
            decryptedResponseObj.paymentMode
        );


        this.$logger.log(`Payment status : ${paymentStatus}`);
        if (paymentStatus !== PaymentStatus.Success) {
            this.$sms.sendSms(
                booking.contact['phoneNumber'],
                SMS_TEMPLATE.paymentFailure,
                [{ bookingId: booking.displayId }]
            );
        }
        else {
            this.$sms.sendSms(
                booking.contact['phoneNumber'],
                SMS_TEMPLATE.paymentConfirmation,
                [{
                    amount: `Rs ${booking.totalCost}`,
                    bookingId: booking.displayId
                }]
            );
        }
        this.$logger.log(`Booking display id : ${booking.displayId}`);

        const encodedData = encodeURIComponent(JSON.stringify({ ...decryptedResponseObj, bookingDisplayId: booking.displayId }));
        return { dataString: encodedData, redirectUrl };
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


    async refundRequest(payload: RefundRequestPayloadDto, userId: string) {
        const booking = await this.$prisma.booking.findFirst({
            where: {
                id: payload.bookingId
            },
        });

        if (!booking) ApiException.badData('BOOKING.NOT_FOUND');
        if (booking.status === BookingStatus.RefundRequested || booking.status === BookingStatus.Refunded) ApiException.badData('PAYMENT.REFUND_ALREADY_REQUESTED');
        if (![BookingStatus.Completed, BookingStatus.Cancelled].includes(booking.status)) ApiException.badData('BOOKING.NOT_COMPLETED');

        const refundMethod = payload.refundMethod;
        let upiId = payload.upiId;
        let bankDetails = null;
        if (refundMethod === PaymentRefundMethod.Upi) {
            upiId = this.$subPaisa.encrypt(payload.upiId);
        }
        if (refundMethod === PaymentRefundMethod.NetBanking) {
            bankDetails = this.$subPaisa.encrypt(JSON.stringify(payload.bankDetails));
        }


        const [refund] = await this.$prisma.$transaction([
            this.$prisma.paymentRefund.create({
                data: {
                    bookingId: payload.bookingId,
                    userId,
                    paymentMethod: payload.refundMethod,
                    upiId,
                    bankDetails,
                    status: PaymentRefundStatus.Requested,
                    refundType: PaymentRefundType.SecurityDeposit,
                    amount: booking.securityDeposit,
                    displayId: await this.generatePaymentRefundId()
                }
            }),
            this.$prisma.booking.update({
                where: {
                    id: payload.bookingId
                },
                data: {
                    status: BookingStatus.RefundRequested
                }
            })

        ]);

        this.$sms.sendSms(
            booking.contact['phoneNumber'],
            SMS_TEMPLATE.refundProcessed,
            [
                {
                    bookingId: booking.displayId
                }
            ]

        )

        return {
            id: refund.id,
            displayId: refund.displayId
        }
    }


    async refundDetailsByBookingId(bookingId: string) {
        const list = await this.$prisma.paymentRefund.findMany({
            where: {
                bookingId
            }
        });
        return list.map(refund => {
            if (refund.paymentMethod === PaymentRefundMethod.Upi) {
                refund.upiId = this.$subPaisa.decrypt(refund.upiId);
            }
            if (refund.paymentMethod === PaymentRefundMethod.NetBanking) {
                refund.bankDetails = JSON.parse(this.$subPaisa.decrypt(refund.bankDetails));
            }
            return refund;
        });
    }


    async refundList(payload: RefundListQueryDto) {
        const { page = 1, limit = 10, sort = 'desc', sortBy = 'createdAt', search } = payload;
        const skip = (page - 1) * limit;
        const where: any = {};
        if (search) where.OR = [
            {
                displayId: { contains: search, mode: 'insensitive' }
            }
        ]

        const [total, data] = await Promise.all([
            this.$prisma.paymentRefund.count({ where }),
            this.$prisma.paymentRefund.findMany({
                where,
                select: {
                    id: true,
                    displayId: true,
                    status: true,
                    paymentMethod: true,
                    upiId: true,
                    bankDetails: true,
                    amount: true,
                    createdAt: true,
                    updatedAt: true,
                    booking: {
                        select: {
                            id: true,
                            displayId: true,
                            examName: true,
                        }
                    }
                },
                orderBy: {
                    [sortBy]: sort
                },
                skip,
                take: limit
            })
        ]);

        return {
            page,
            limit,
            total,
            data: data.map(refund => {
                if (refund.paymentMethod === PaymentRefundMethod.Upi) {
                    refund.upiId = this.$subPaisa.decrypt(refund.upiId);
                }
                if (refund.paymentMethod === PaymentRefundMethod.NetBanking) {
                    refund.bankDetails = JSON.parse(this.$subPaisa.decrypt(refund.bankDetails));
                }
                return refund;
            })
        }
    }




    async refundDetails(id: string) {
        const refund = await this.$prisma.paymentRefund.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                displayId: true,
                status: true,
                paymentMethod: true,
                upiId: true,
                bankDetails: true,
                amount: true,
                createdAt: true,
                updatedAt: true,
                booking: {
                    select: {
                        id: true,
                        displayId: true,
                        examName: true,
                    }
                },
                comment: true,
                statusAt: true,
                refundType: true,
                statusBy: {
                    select: {
                        id: true,
                        displayId: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        if (!refund) ApiException.badData('REFUND.NOT_FOUND');
        if (refund.paymentMethod === PaymentRefundMethod.Upi) {
            refund.upiId = this.$subPaisa.decrypt(refund.upiId);
        }
        if (refund.paymentMethod === PaymentRefundMethod.NetBanking) {
            refund.bankDetails = JSON.parse(this.$subPaisa.decrypt(refund.bankDetails));
        }
        return refund;
    }


    async refundStatus(payload: RefundStatusPayloadDto, adminId: string, id: string) {
        const refund = await this.$prisma.paymentRefund.findFirst({
            where: {
                id
            }
        });
        if (!refund) ApiException.badData('REFUND.NOT_FOUND');

        await this.$prisma.paymentRefund.update({
            where: {
                id
            },
            data: {
                status: payload.status,
                statusAt: new Date(),
                adminId: adminId,
                comment: payload.comment
            }
        });

        if (payload.status === PaymentRefundStatus.Approved) {
            await this.$prisma.booking.update({
                where: {
                    id: refund.bookingId
                },
                data: {
                    status: BookingStatus.Refunded
                }
            })
        }
        if (payload.status === PaymentRefundStatus.Rejected) {
            await this.$prisma.booking.update({
                where: {
                    id: refund.bookingId
                },
                data: {
                    status: BookingStatus.RefundRejected
                }
            })
        }

        return {
            id: refund.id,
            displayId: refund.displayId,
            status: payload.status,
        }
    }
}

