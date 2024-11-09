import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { dateStringToUtc, OpenId } from "src/utils";
import { BookingDateTimeSlotDto, CreateBookingPayloadDto } from "./dto/create.dto";
import { BookingStatus } from "./booking.constant";
import { v4 as uuid } from 'uuid'
import { HallService } from "../halls/hall.service";
import { IHall } from "../halls/interfaces/hall";

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

    private async handleAwaitingForPayment(payload: CreateBookingPayloadDto, userId: String) {

        const bookingData = {
            id: payload.id || uuid(),
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
        let halls = {};
        let slots = {};
        const bookingHall = [];

        const notAvailableHalls = [];
        for (const slot of payload.timeSlots) {
            const date = dateStringToUtc(slot.date);
            const halls = await this.$hall.availableHallsForDate(slot.slotId, date);
            const totalCapacity = halls.reduce((acc: number, hall: IHall) => acc + hall.capacity, 0);
            if (totalCapacity < payload.noOfCandidates) {
                notAvailableHalls.push(slot);
                break
            }
            const bookingHallObj = {
                bookingId: bookingData.id,
                timeSlotId: slot.slotId,
                quantity: 0,
                totalPrice: 0,
                date
            }

            slots[slot.slotId] = date;
        }
    }
}