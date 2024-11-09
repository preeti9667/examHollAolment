import { PrismaService } from "@app/databases/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { dateStringToUtc, format24TO12, OpenId } from "src/utils";
import { HallAvailabilityQueryDto } from "./dto/availability.dto";
import { ApiException } from "../api.exception";

@Injectable()
export class HallService {
    constructor(private $prisma: PrismaService) {
        // this.createDummyHall();

        // this.availableHallsForDate('93a54500-eb70-4ec0-be40-41bb735b9dc7', dateStringToUtc('2024-11-11'))
    }


    async createDummyHall() {
        for (let i = 20; i < 40; i++) {
            const displayId = OpenId.create(8);
            const name = `Hall ${i + 1}`;
            const groupName = `Group ${i < 5 ? 'A' : i > 5 && i > 11 ? 'B' : 'c'}`;
            const capacity = Math.floor(Math.random() * ((500 - 60) / 10 + 1)) * 10 + 60;
            const slots = i % 2 == 0 ? ['93a54500-eb70-4ec0-be40-41bb735b9dc7'] : ['9a4523db-3a4e-4435-b8e4-5dc3e28613b0', '9a4523db-3a4e-4435-b8e4-5dc3e28613b0'];

            await this.$prisma.hall.create({
                data: {
                    displayId,
                    name,
                    groupName,
                    capacity,
                    slots
                }
            })
        }
    }


    async availability(query: HallAvailabilityQueryDto) {
        const startDate = dateStringToUtc(query.startDate);
        const endDate = dateStringToUtc(query.endDate);
        if (startDate > endDate || startDate < new Date() || endDate < new Date()) {
            ApiException.badData('HALL.INVALID_DATES')
        }
        const noOfCandidates = query.noOfCandidates;

        const sqlQuery = `
                WITH date_series AS (
                    SELECT generate_series(
                    $1::date, 
                    $2::date, 
                    '1 day'::interval
                    )::date AS "bookingDate"
                )
                SELECT
                    ds."bookingDate",
                    slot,
                    SUM(H.capacity) AS "totalCapacity"
                FROM
                    date_series ds
                CROSS JOIN
                    public."Hall" AS H,
                    unnest(H."slots") AS slot
                WHERE
                    H."isActive" = true
                    AND H."isDeleted" = false
                    AND ds."bookingDate" NOT IN (
                    SELECT "date"
                    FROM public."BookingHall"
                    WHERE "hallId" = H.id
                    AND "bookingId" NOT IN (
                        SELECT "id"
                        FROM public."Booking"
                        WHERE "status" IN (30, 50)
                    )
                    )
                GROUP BY
                    ds."bookingDate", slot
                ORDER BY
                    ds."bookingDate", "totalCapacity" DESC;
                `;

        const data = await this.$prisma.$queryRawUnsafe(sqlQuery, startDate, endDate);

        const slots = await this.$prisma.timeSlot.findMany({});
        const slotsObj = {};
        slots.forEach(e => {
            slotsObj[e.id] = e;
        });
        const groupByDateObj = {};
        (data as any[]).forEach(e => {
            if (!groupByDateObj[e.bookingDate]) {
                groupByDateObj[e.bookingDate] = {
                    date: e.bookingDate,
                    slots: [
                        {
                            id: e.slot,
                            isAvailable: noOfCandidates < e.totalCapacity ? true : false,
                            from: format24TO12(slotsObj[e.slot].from),
                            to: format24TO12(slotsObj[e.slot].to),
                            capacity: Number(e.totalCapacity)
                        }
                    ]
                }
            }
            else {
                groupByDateObj[e.bookingDate].slots.push({
                    id: e.slot,
                    isAvailable: Number(e.totalCapacity) - noOfCandidates >= 0 ? true : false,
                    from: format24TO12(slotsObj[e.slot].from),
                    to: format24TO12(slotsObj[e.slot].to),
                    capacity: Number(e.totalCapacity)
                })
            }
        });

        return Object.values(groupByDateObj)

    }


    async availableHallsForDate(slotId: string, date: Date) {
        const query = `
        SELECT
            *
            FROM
            public."Hall" AS H
            WHERE
            H."isActive" = true
            AND H."isDeleted" = false
            AND $1 = ANY(H."slots")
            AND H."id" NOT IN (
                SELECT "hallId"
                FROM public."BookingHall"
                WHERE "date" <> $2:date
                AND "bookingId" NOT IN (
                SELECT "id"
                FROM public."Booking"
                WHERE "status" NOT IN (30, 50)
                )
            )
                `;

        const data = await this.$prisma.$queryRawUnsafe(query);

        console.log(data)

    }
}