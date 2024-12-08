import { PrismaService } from "@app/databases/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { DashboardQueryDto } from "./dto/dashboard.dto";
import { ApiException } from "../api.exception";
import { dateStringToUtc } from "src/utils";
import { BookingStatus } from "../bookings/booking.constant";
import { PaymentRefundStatus } from "../payments/payment.constant";

@Injectable()
export class DashboardService {
    constructor(private $prisma: PrismaService) { }

    async getDashboardData(
        payload: DashboardQueryDto
    ) {
        let { fromDate, toDate } = payload;

        const where = {} as any;
        if (fromDate) where.createdAt = {
            gte: dateStringToUtc(fromDate),
        }

        if (toDate) where.createdAt = {
            lte: dateStringToUtc(toDate),
        }
        if (fromDate && toDate) {
            if (dateStringToUtc(fromDate) > dateStringToUtc(toDate))
                ApiException.badData('BOOKING.INVALID_DATE_RANGE');
            where.createdAt = {
                gte: dateStringToUtc(fromDate),
                lte: dateStringToUtc(toDate)
            }
        }



        const [totalRevenue, avgRevenue, bookingCount, refundCount] = await Promise.all([
            this.$prisma.booking.aggregate({
                _sum: {
                    totalCost: true
                },
                where: {
                    status: {
                        not: BookingStatus.AutoCancelled
                    },
                    isPaymentDone: true,
                    ...where,
                }
            }),
            this.$prisma.booking.aggregate({
                _avg: {
                    totalCost: true
                },
                where: {
                    status: {
                        not: BookingStatus.AutoCancelled
                    },
                    isPaymentDone: true,
                    ...where,
                }
            }),
            this.$prisma.booking.aggregate({
                _count: {
                    id: true
                },
                where: {
                    status: {
                        in: [
                            BookingStatus.Refunded,
                            BookingStatus.Completed,
                            BookingStatus.RefundRejected
                        ]
                    },
                    isPaymentDone: true,
                    cancelReason: null,
                    ...where,
                }
            }),
            this.$prisma.paymentRefund.aggregate({
                _count: {
                    id: true
                },
                where: {
                    status: PaymentRefundStatus.Requested,
                    ...where,
                }
            })
        ]);

        return {
            totalRevenue: totalRevenue._sum.totalCost || 0,
            avgBookingValue: avgRevenue._avg.totalCost || 0,
            bookingCompleted: bookingCount._count.id,
            refundPending: refundCount._count.id,
            fromDate,
            toDate
        }
    }
}