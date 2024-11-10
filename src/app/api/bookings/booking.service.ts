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
                quantity: seatsToAllocate,
                capacity: hall.capacity
            });

            remainingSeats -= seatsToAllocate;
        }

        return allocation;
    }

    private async handleAwaitingForPayment(payload: CreateBookingPayloadDto, userId: String) {
        if (payload.id) {
            const isBooking = await this.$prisma.booking.findFirst({
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
            const allocateHalls = this.allocateHalls(halls, bookingData.noOfCandidates);

            const bookingHallObj = {
                bookingId: id,
                timeSlotId: slot.slotId,
                quantity: 0,
                totalPrice: 0,
                date
            }

            allocateHalls.forEach(e => {
                hallsObj[e.id] = date;
                hallIds.push(e.id);
                bookingHall.push(
                    {
                        ...bookingHallObj,
                        hallId: e.id,
                        quantity: e.quantity,
                    }
                )
            })
            timeSlots[utcToDateString(date)] = slot.slotId;
        }

        if (payload.id)
            delete bookingData.displayId;


        const [newBooking] = await this.$prisma.$transaction([
            this.$prisma.booking.upsert({
                where: { id },
                create: { id, ...bookingData, timeSlots, halls: hallsObj, hallIds },
                update: { ...bookingData, timeSlots, halls: hallsObj, hallIds }
            }),
            this.$prisma.bookingHall.createMany(
                { data: bookingHall }
            )
        ])


        return {
            id: newBooking.id,
            displayId: newBooking.displayId,
            paymentLink: '',
            noOfCandidates: payload.noOfCandidates
        }

    }
}