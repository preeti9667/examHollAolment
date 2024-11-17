import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { dateStringToUtc, OpenId } from "src/utils";
import { CreateBookingPayloadDto } from "./dto/create.dto";
import { BookingStatus } from "./booking.constant";
import { v4 as uuid } from 'uuid'
import { HallService } from "../halls/hall.service";
import { IHall } from "../halls/interfaces/hall";
import { ApiException } from "../api.exception";
import { PaymentStatus } from "../payments/payment.constant";
import { BookingListQueryDto } from "./dto/list.dto";
import { CostEstimatePayloadDto } from "./dto/cost-estimate.dto";

@Injectable()
export class BookingService {

    constructor(
        private $prisma: PrismaService,
        private $logger: LoggerService,
        private $hall: HallService,
    ) { }

    private getBookingDisplayId(): string {
        return OpenId.format('BK', 8) as string
    }

    async createBooking(payload: CreateBookingPayloadDto, userId: string) {
        if (payload.status === BookingStatus.Draft) {
            return this.handleBookingDraft(payload, userId);
        }

        if (payload.status === BookingStatus.AwaitingForPayment) {
            return this.handleAwaitingForPayment(payload, userId)
        }
    }

    private async handleBookingDraft(payload: CreateBookingPayloadDto, userId: string) {
        const newBooking = await this.$prisma.booking.create({
            data: {
                organizationName: payload.organizationName,
                applicantName: payload.applicantName,
                displayId: this.getBookingDisplayId(),
                institutionType: payload.institutionType,
                examName: payload.examName,
                noOfCandidates: payload.noOfCandidates,
                contact: {
                    phoneNumber: payload.phoneNumber,
                    countryCode: payload.countryCode,
                    email: payload.email
                },
                address: {
                    ...payload.address
                },
                status: BookingStatus.Draft,
                userId
            }
        });

        return {
            id: newBooking.id,
            displayId: newBooking.displayId,
            stats: BookingStatus.Draft
        }
    }

    private allocateHalls(halls: IHall[], capacity: number) {
        const sortedHalls = halls.sort((a, b) => b.capacity - a.capacity);
        let remainingSeats = capacity;
        let allocation = [];

        for (const hall of sortedHalls) {
            if (remainingSeats <= 0) break;
            const seatsToAllocate = Math.min(hall.capacity, remainingSeats);
            allocation.push({
                id: hall.id,
                hallName: hall.name,
                groupName: hall.groupName,
                displayId: hall.displayId,
                seatsAllocated: seatsToAllocate,
                capacity: hall.capacity,
                totalPrice: hall.price,
            });

            remainingSeats -= seatsToAllocate;
        }

        return allocation;
    }

    private async handleAwaitingForPayment(payload: CreateBookingPayloadDto, userId: String) {
        let isBooking;
        if (payload.id) {
            isBooking = await this.$prisma.booking.findFirst({
                where: {
                    id: payload.id,
                    status: BookingStatus.Draft
                }
            });
            if (!isBooking) ApiException.badData('BOOKING.INVALID_ID');
        }

        let id = payload.id || uuid();
        const bookingData: any = {
            organizationName: payload.organizationName,
            applicantName: payload.applicantName,
            displayId: isBooking?.displayId || this.getBookingDisplayId(),
            institutionType: payload.institutionType,
            examName: payload.examName,
            noOfCandidates: payload.noOfCandidates,
            contact: {
                phoneNumber: payload.phoneNumber,
                countryCode: payload.countryCode,
                email: payload.email
            },
            address: {
                ...payload.address
            },
            status: BookingStatus.AwaitingForPayment,
            userId,
            startDate: dateStringToUtc(payload.startDate),
            endDate: dateStringToUtc(payload.endDate)
        }
        const bookingHall = [];
        const slots = await this.$prisma.timeSlot.findMany();
        let timeSlots: any = {};
        slots.forEach(e => {
            timeSlots[e.id] = {
                id: e.id,
                from: e.from,
                to: e.to,
            }
        })

        const hallIds = [];
        const notAvailableHalls = [];
        let totalCost = 0;
        let noOfCandidates = 0;

        for (const slot of payload.timeSlots) {
            const date = dateStringToUtc(slot.date);
            const halls = await this.$hall.availableHallsForDate(slot.slotId, date);
            const totalCapacity = halls.reduce((acc: number, hall: IHall) => acc + hall.capacity, 0);
            if (totalCapacity < slot.noOfCandidates) {
                notAvailableHalls.push(slot);
                break
            }
            noOfCandidates += slot.noOfCandidates;
            const allocateHalls = this.allocateHalls(halls, slot.noOfCandidates);

            const bookingHallObj = {
                bookingId: id,
                timeSlotId: slot.slotId,
                date,
                status: BookingStatus.AwaitingForPayment
            }

            allocateHalls.forEach(e => {
                totalCost += e.totalPrice;
                hallIds.push(e.id);
                bookingHall.push(
                    {
                        ...bookingHallObj,
                        hallId: e.id,
                        seatsAllocated: e.seatsAllocated,
                        totalPrice: e.totalPrice,
                        hallRaw: {
                            id: e.id,
                            displayId: e.displayId,
                            name: e.hallName,
                            groupName: e.groupName,
                            capacity: e.capacity
                        },
                        slotRaw: timeSlots[slot.slotId]
                    }
                )
            })
        }

        if (notAvailableHalls.length) {
            ApiException.gone('BOOKING.HALL_NOT_AVAILABLE')
        }

        // const totalCost = bookingHall.reduce((acc: number, hall: any) => acc + hall.totalPrice, 0);
        // const noOfCandidates = bookingHall.reduce((acc: number, hall: any) => acc + hall.seatsAllocated, 0);
        const hallAllocated = bookingHall.length;
        const [newBooking] = await this.$prisma.$transaction([
            this.$prisma.booking.upsert({
                where: { id },
                create: {
                    id,
                    ...bookingData,
                    totalCost,
                    noOfCandidates,
                    hallAllocated
                },
                update: {
                    ...bookingData,
                    totalCost,
                    noOfCandidates,
                    hallAllocated
                }
            }),
            this.$prisma.bookingHall.createMany(
                { data: bookingHall }
            )
        ]);

        return {
            id: newBooking.id,
            displayId: newBooking.displayId,
            noOfCandidates,
            hallAllocated,
            status: BookingStatus.AwaitingForPayment,
            totalCost,
            paymentLink: null,
        }

    }


    async handleBookingPaymentStatus(
        bookingId: string,
        paymentStatus: PaymentStatus,
        paymentMode: string
    ) {
        let bookingStatus = BookingStatus.Booked;
        if (paymentStatus !== PaymentStatus.Success)
            bookingStatus = BookingStatus.Failed;

        const [booking] = await Promise.all([
            this.$prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: bookingStatus,
                    paymentMethod: paymentMode
                }
            }),
            this.$prisma.bookingHall.updateMany({
                where: { bookingId },
                data: { status: bookingStatus }
            })
        ]);

        this.$logger.log(`Booking status updated for booking ${bookingId} after payment`);
        return booking.displayId;
    }



    async handleAwaitingForPaymentBooking() {
        const bookings = await this.$prisma.$queryRawUnsafe(`
        SELECT * FROM public."Booking"
        WHERE "status" = ${BookingStatus.AwaitingForPayment}
        AND AGE(NOW(), "createdAt") > INTERVAL '25 minutes';
        `) as any[];

        if (bookings.length) {
            for (const booking of bookings) {
                await Promise.all(
                    [
                        this.$prisma.booking.update(
                            {
                                where: { id: booking.id },
                                data: { status: BookingStatus.Cancelled }
                            }
                        ),
                        this.$prisma.bookingHall.updateMany({
                            where: {
                                bookingId: booking.id
                            },
                            data: {
                                status: BookingStatus.Cancelled
                            }
                        })
                    ]
                );

                this.$logger.log(`Booking : ${booking.displayId} is cancelled automatically`)
            }
        }

    }


    async bookingDetails(id: string, userId: string) {
        const booking = await this.$prisma.booking.findFirst({
            where: { id, userId },
            select: {
                id: true,
                displayId: true,
                noOfCandidates: true,
                hallAllocated: true,
                totalCost: true,
                status: true,
                startDate: true,
                endDate: true,
                createdAt: true,
                updatedAt: true,
                contact: true,
                address: true,
                bookingHall: {
                    select: {
                        id: true,
                        date: true,
                        seatsAllocated: true,
                        totalPrice: true,
                        hallRaw: true,
                        slotRaw: true
                    }
                }
            }
        });

        if (!booking) {
            ApiException.notFound('BOOKING.NOT_FOUND')
        }
        const payments = await this.$prisma.payment.findMany({
            where: { bookingId: id },
            select: {
                id: true,
                transactionId: true,
                sabpaisaTxnId: true,
                status: true,
                amount: true,
                paidAmount: true,
                currency: true,
                paymentMode: true,
                transDate: true,
                transaction: true,
                createdAt: true,
                updatedAt: true
            }
        });
        booking['payments'] = payments;
        return booking;
    }


    async list(payload: BookingListQueryDto, userId: string) {
        const { page = 1, limit = 10, sort = 'desc', sortBy = 'createdAt', status } = payload;
        const skip = (page - 1) * limit;
        const where: any = { userId };
        if (status) where.status = status;
        const [total, data] = await Promise.all([
            this.$prisma.booking.count({ where }),
            this.$prisma.booking.findMany({
                where,
                select: {
                    id: true,
                    displayId: true,
                    status: true,
                    noOfCandidates: true,
                    hallAllocated: true,
                    examName: true,
                    startDate: true,
                    endDate: true,
                    createdAt: true,
                    updatedAt: true
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
            data
        }
    }


    async costEstimate(payload: CostEstimatePayloadDto) {
        let totalCost = 0;
        let totalHalls = 0;
        let noOfCandidates = 0;
        const notAvailableHalls = [];
        for (const slot of payload.timeSlots) {
            const date = dateStringToUtc(slot.date);
            const halls = await this.$hall.availableHallsForDate(slot.slotId, date);
            const totalCapacity = halls.reduce((acc: number, hall: IHall) => acc + hall.capacity, 0);
            if (totalCapacity < slot.noOfCandidates) {
                notAvailableHalls.push(slot);
                break
            }
            noOfCandidates += slot.noOfCandidates;
            const allocateHalls = this.allocateHalls(halls, slot.noOfCandidates);
            allocateHalls.forEach(e => {
                totalCost += e.totalPrice;
                totalHalls += 1
            })
        }

        if (notAvailableHalls.length) {
            ApiException.gone('BOOKING.HALL_NOT_AVAILABLE')
        }

        return {
            totalCost,
            totalHalls,
            noOfCandidates
        }
    }
}