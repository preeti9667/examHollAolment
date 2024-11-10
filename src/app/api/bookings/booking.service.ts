import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { dateStringToUtc, OpenId, utcToDateString } from "src/utils";
import { BookingDateTimeSlotDto, CreateBookingPayloadDto } from "./dto/create.dto";
import { BookingStatus } from "./booking.constant";
import { v4 as uuid } from 'uuid'
import { HallService } from "../halls/hall.service";
import { IHall } from "../halls/interfaces/hall";
import { ApiException } from "../api.exception";

@Injectable()
export class BookingService {

    constructor(
        private $prisma: PrismaService,
        private $logger: LoggerService,
        private $hall: HallService
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
                seatsAllocated: seatsToAllocate,
                capacity: hall.capacity,
                totalPrice: hall.price
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
        let hallsObj: any = {};
        let timeSlots: any = {};
        const bookingHall = [];

        const hallIds = [];
        const notAvailableHalls = [];
        for (const slot of payload.timeSlots) {
            const date = dateStringToUtc(slot.date);
            const halls = await this.$hall.availableHallsForDate(slot.slotId, date);
            const totalCapacity = halls.reduce((acc: number, hall: IHall) => acc + hall.capacity, 0);
            if (totalCapacity < payload.noOfCandidates) {
                notAvailableHalls.push(slot);
                break
            }
            const allocateHalls = this.allocateHalls(halls, slot.noOfCandidates);

            const bookingHallObj = {
                bookingId: id,
                timeSlotId: slot.slotId,
                date
            }

            allocateHalls.forEach(e => {
                hallsObj[e.id] = date;
                hallIds.push(e.id);
                bookingHall.push(
                    {
                        ...bookingHallObj,
                        hallId: e.id,
                        seatsAllocated: e.seatsAllocated,
                        totalPrice: e.totalPrice
                    }
                )
            })
            timeSlots[utcToDateString(date)] = slot.slotId;
        }

        if (notAvailableHalls.length) {
            ApiException.gone('BOOKING.HALL_NOT_AVAILABLE')
        }

        const totalCost = bookingHall.reduce((acc: number, hall: any) => acc + hall.totalPrice, 0);
        const noOfCandidates = bookingHall.reduce((acc: number, hall: any) => acc + hall.seatsAllocated, 0);
        const hallAllocated = bookingHall.length;
        const [newBooking] = await this.$prisma.$transaction([
            this.$prisma.booking.upsert({
                where: { id },
                create: {
                    id,
                    ...bookingData,
                    timeSlots,
                    halls: hallsObj,
                    totalCost,
                    noOfCandidates,
                    hallAllocated
                },
                update: {
                    ...bookingData,
                    timeSlots,
                    halls: hallsObj,
                    totalCost,
                    noOfCandidates,
                    hallAllocated
                }
            }),
            this.$prisma.bookingHall.createMany(
                { data: bookingHall }
            )
        ])


        return {
            id: newBooking.id,
            displayId: newBooking.displayId,
            noOfCandidates,
            hallAllocated,
            totalCost,
            paymentLink: '',
        }

    }



    async handleAwaitingForPaymentBooking() {
        const bookings = await this.$prisma.$queryRawUnsafe(`
        SELECT * FROM public."Booking"
        WHERE "status" = ${BookingStatus.AwaitingForPayment}
        AND AGE(NOW(), "createdAt") > INTERVAL '25 minutes';
        `) as any[];

        if (bookings.length) {
            for (const booking of bookings) {
                await this.$prisma.booking.update({ where: { id: booking.id }, data: { status: BookingStatus.Cancelled } })
            }
        }

    }
}