import { PrismaService } from "@app/databases/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { dateStringToUtc, format24TO12, OpenId, utcToDateString } from "src/utils";
import { HallAvailabilityQueryDto } from "./dto/availability.dto";
import { ApiException } from "../api.exception";
import { CreateHallDto } from "./dto/create.dto";
import { LoggerService } from "@app/shared/logger";
import { Prisma } from "@prisma/client";
import { IHall } from "./interfaces/hall";

@Injectable()
export class HallService {
    constructor(
        private $prisma: PrismaService,
        private $logger: LoggerService
    ) {
        // this.createDummyHall();

        // this.availableHallsForDate('93a54500-eb70-4ec0-be40-41bb735b9dc7', dateStringToUtc('2024-11-11'))
    }


    async createDummyHall() {
        for (let i = 0; i < 44; i++) {
            const displayId = OpenId.create(8);
            const name = `Hall ${i + 1}`;
            const groupName = `Group ${i < 5 ? 'A' : i > 5 && i > 11 ? 'B' : 'c'}`;
            const capacity = 250;
            const price = 20000;
            const slots = i % 2 == 0 ? ['1b53c972-bdc7-4cfb-bf86-90a55e8b95ae'] : ['1b53c972-bdc7-4cfb-bf86-90a55e8b95ae', '7fec2a37-d6ff-4d6f-bee8-b97df8b843d2'];

            await this.$prisma.hall.create({
                data: {
                    displayId,
                    name,
                    groupName,
                    capacity,
                    slots,
                    price
                }
            })


            console.log(i, "Hall created")
        }
    }


    async availability(query: HallAvailabilityQueryDto) {
        const startDate = dateStringToUtc(query.startDate);
        const endDate = dateStringToUtc(query.endDate);

        if (startDate > endDate || startDate < new Date() || endDate < new Date()) {
            ApiException.badData('HALL.INVALID_DATES')
        }
        const noOfCandidates = query.noOfCandidates;

        // const sqlQuery = `
        //         WITH date_series AS (
        //             SELECT generate_series(
        //             $1::date, 
        //             $2::date, 
        //             '1 day'::interval
        //             )::date AS "bookingDate"
        //         )
        //         SELECT
        //             ds."bookingDate",
        //             slot,
        //             SUM(H.capacity) AS "totalCapacity"
        //         FROM
        //             date_series ds
        //         CROSS JOIN
        //             public."Hall" AS H,
        //             unnest(H."slots") AS slot
        //         WHERE
        //             H."isActive" = true
        //             AND H."isDeleted" = false
        //             AND H."id" NOT IN (
        //                 SELECT "hallId"
        //                 FROM public."BookingHall"
        //                 WHERE "date" <> ds."bookingDate"
        //                 AND "bookingId" NOT IN (
        //                 SELECT "id"
        //                 FROM public."Booking"
        //                 WHERE "status" NOT IN (30, 50)
        //                 )
        //             )
        //         GROUP BY
        //             ds."bookingDate", slot
        //         ORDER BY
        //             ds."bookingDate", "totalCapacity" DESC;
        //         `;

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
                    SUM(H.capacity) AS "totalCapacity",
                    COUNT(H.id) AS "hallCount"
                FROM
                    date_series ds
                CROSS JOIN
                    public."Hall" AS H,
                    unnest(H."slots") AS slot
                WHERE
                    H."isActive" = true
                    AND H."isDeleted" = false
                    AND H."id" NOT IN (
                        SELECT "hallId"
                        FROM public."BookingHall"
                        WHERE "date" <> ds."bookingDate"
                        AND "bookingId" NOT IN (
                        SELECT "id"
                        FROM public."Booking"
                        WHERE "status" NOT IN (30, 50)
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
                    date: utcToDateString(e.bookingDate),
                    slots: [
                        {
                            id: e.slot,
                            isAvailable: noOfCandidates < e.totalCapacity ? true : false,
                            from: format24TO12(slotsObj[e.slot].from),
                            to: format24TO12(slotsObj[e.slot].to),
                            capacity: Number(e.totalCapacity),
                            hallCount: Number(e.hallCount)
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
                    capacity: Number(e.totalCapacity),
                    hallCount: Number(e.hallCount)
                })
            }
        });

        return Object.values(groupByDateObj)

    }


    async availableHallsForDate(slotId: string, date: Date): Promise<IHall[]> {
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
                WHERE "date" <> $2
                AND "timeSlotId" = $3
                AND "bookingId" NOT IN (
                SELECT "id"
                FROM public."Booking"
                WHERE "status" NOT IN (30, 50)
                )
            )
            `;
        const data = await this.$prisma.$queryRawUnsafe(query, slotId, date, slotId);
        return data as IHall[];
    }


    async create(payload: CreateHallDto) {
        try {
            await this.$prisma.hall.create({
                data: {
                    displayId: OpenId.format('HALL'),
                    ...payload
                }
            })
            return true;
        } catch (err) {
            this.$logger.error(err.message, err.stack);
            throw err;
        }
    }

}