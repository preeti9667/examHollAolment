import { PrismaService } from "@app/databases/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { dateStringToUtc, format24TO12, OpenId, utcToDateString } from "src/utils";
import { HallAvailabilityQueryDto } from "./dto/availability.dto";
import { ApiException } from "../api.exception";
import { CreateHallDto } from "./dto/create.dto";
import { LoggerService } from "@app/shared/logger";
import { ListHallQueryDto } from "./dto/list.dto";
import { Prisma } from "@prisma/client";
import { IHall } from "./interfaces/hall";
import { BookingStatus } from "../bookings/booking.constant";
import { EditHallDto } from "./dto/edit.dto";

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
        const hall_data = [
            {
                "groupName": "Block A",
                "capacity": 273,
                "floor": 0,
                "quantity": 2
            },
            {
                "groupName": "Block A",
                "capacity": 273,
                "floor": 1,
                "quantity": 4
            },
            {
                "groupName": "Block A",
                "capacity": 273,
                "floor": 2,
                "quantity": 4
            },
            {
                "groupName": "Block A",
                "capacity": 273,
                "floor": 3,
                "quantity": 4
            },
            {
                "groupName": "Block A",
                "capacity": 273,
                "floor": 4,
                "quantity": 4
            },
            {
                "groupName": "Block A",
                "capacity": 273,
                "floor": 5,
                "quantity": 4
            },
            {
                "groupName": "Block B",
                "capacity": 273,
                "floor": 0,
                "quantity": 3
            },
            {
                "groupName": "Block B",
                "capacity": 273,
                "floor": 1,
                "quantity": 3
            },
            {
                "groupName": "Block B",
                "capacity": 273,
                "floor": 2,
                "quantity": 4
            },
            {
                "groupName": "Block B",
                "capacity": 273,
                "floor": 3,
                "quantity": 4
            },
            {
                "groupName": "Block B",
                "capacity": 273,
                "floor": 4,
                "quantity": 4
            },
            {
                "groupName": "Block B",
                "capacity": 273,
                "floor": 5,
                "quantity": 4
            }
        ]

        for (let i = 0; i < hall_data.length; i++) {
            const h = hall_data[i];
            if (h.quantity > 0) {
                for (let j = 0; j < h.quantity; j++) {
                    const displayId = OpenId.format('H', 8);;
                    const groupName = h.groupName;
                    const capacity = h.capacity;
                    const floor = h.floor;
                    const price = 20000;
                    const slots = ['1b53c972-bdc7-4cfb-bf86-90a55e8b95ae', '7fec2a37-d6ff-4d6f-bee8-b97df8b843d2'];
                    const name = `${groupName.split(' ')[1]} ${floor}-${j + 1}`;

                    const hall = await this.$prisma.hall.create({
                        data: {
                            displayId,
                            name,
                            groupName,
                            capacity,
                            slots,
                            price,
                            floor
                        }
                    })

                    for (const t of slots) {
                        await this.$prisma.hallTimeSlot.create({
                            data: {
                                hallId: hall.id,
                                timeSlotId: t
                            }
                        })
                    }


                    console.log(name, "Hall created")
                }
            }

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
                    AND NOT EXISTS (
                        SELECT 1
                        FROM public."OffDate" AS OD
                        WHERE OD."date" = ds."bookingDate"
                        AND OD."timeSlotId" = slot
                    )
                    AND H."id" NOT IN (
                        SELECT "hallId"
                        FROM public."BookingHall"
                        WHERE "date" = ds."bookingDate"
                        AND "timeSlotId" = slot
                        AND "status" IN (30, 50, 60)
                    )
                GROUP BY
                    ds."bookingDate", slot
                ORDER BY
                    ds."bookingDate", "slot" ASC;
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

    async availabilityNew(query: HallAvailabilityQueryDto) {
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
                    DS."bookingDate",
                    HTS."timeSlotId" AS "timeSlotId",
                    SUM(H."capacity")-SUM(COALESCE((BH."hallRaw"->>'capacity')::INTEGER, 0)) AS "totalCapacity",
                    COUNT(H."id")-COUNT(BH."hallId") AS "hallCount",
                    (
                        SELECT JSON_BUILD_OBJECT(
                            'date', OD.date,
                            'offType', OD."offType"
                        )
                        FROM public."OffDate" OD
                        WHERE OD."date" = DS."bookingDate"
                        LIMIT 1
                    ) AS "offDate",
                    (
                        SELECT JSON_BUILD_OBJECT(
                            'id',TS.id,
                            'from',TS.from,
                            'to',TS.to
                        )
                        FROM public."TimeSlot" TS
                        WHERE TS."id" = HTS."timeSlotId"
                        LIMIT 1
                    ) AS "slot"
                FROM date_series DS
                CROSS JOIN public."Hall" H
                JOIN public."HallTimeSlot" HTS
                 ON HTS."hallId" = H.id
                LEFT JOIN public."BookingHall" BH
                ON BH."hallId" = H.id
                AND BH.date = DS."bookingDate"
                AND BH.status IN (30, 50, 60)
                AND HTS."timeSlotId" = BH."timeSlotId"
                WHERE H."isActive" = true
                GROUP BY DS."bookingDate", HTS."timeSlotId"
                ORDER BY DS."bookingDate" ASC, HTS."timeSlotId";
                `;

        const data = await this.$prisma.$queryRawUnsafe(sqlQuery, startDate, endDate);



        const groupByDateObj = {};
        (data as any[]).forEach(e => {
            if (!groupByDateObj[e.bookingDate]) {
                groupByDateObj[e.bookingDate] = {
                    date: utcToDateString(e.bookingDate),
                    slots: [
                        {
                            id: e.slot.id,
                            isAvailable: e.offDate ? false : noOfCandidates < e.totalCapacity ? true : false,
                            from: format24TO12([e.slot]['from']),
                            to: format24TO12([e.slot]['to']),
                            capacity: e.offDate ? 0 : Number(e.totalCapacity),
                            hallCount: e.offDate ? 0 : Number(e.hallCount),
                            offDate: e.offDate,
                        }
                    ]
                }
            }
            else {
                groupByDateObj[e.bookingDate].slots.push({
                    id: e.slot.id,
                    isAvailable: e.offDate ? false : noOfCandidates < e.totalCapacity ? true : false,
                    from: format24TO12([e.slot]['from']),
                    to: format24TO12([e.slot]['to']),
                    capacity: e.offDate ? 0 : Number(e.totalCapacity),
                    hallCount: e.offDate ? 0 : Number(e.hallCount),
                    offDate: e.offDate,
                })
            }
        });

        return Object.values(groupByDateObj)

    }


    async availableHallsForDate(slotId: string, date: Date): Promise<IHall[]> {


        const query = Prisma.sql`
         SELECT
             *
             FROM
             public."Hall" AS H
             WHERE
             H."isActive" = true
             AND H."isDeleted" = false
             AND NOT EXISTS (
                        SELECT 1
                        FROM public."OffDate" AS OD
                        WHERE OD."date" = ${date}::date
                        AND OD."timeSlotId" = ${slotId}
                )
             AND H.id IN (
                 SELECT "hallId" FROM public."HallTimeSlot"
                 WHERE "timeSlotId" = ${slotId}
             )
             AND H."id" NOT IN (
                 SELECT "hallId"
                 FROM public."BookingHall"
                 WHERE "date" = ${date}::date
                 AND "timeSlotId" = ${slotId}
                 AND "status" IN (30, 50, 60)
             )
             `;
        const data = await this.$prisma.$queryRaw(query);
        return data as any[];
    }


    async create(payload: CreateHallDto) {
        const hall = await this.$prisma.hall.create({
            data: {
                displayId: OpenId.format('H', 8),
                ...payload
            }
        })

        for (const t of hall.slots) {
            await this.$prisma.hallTimeSlot.create({
                data: {
                    hallId: hall.id,
                    timeSlotId: t
                }
            })
        }
        return true;
    }

    async edit(payload: EditHallDto, hallId: string) {
        const hall = await this.$prisma.hall.findFirst({
            where: {
                id: hallId
            }
        });
        if (!hall) ApiException.badData('HALL.INVALID_ID');

        await this.$prisma.hall.update({
            where: {
                id: hallId
            },
            data: {
                name: payload.name || hall.name,
                groupName: payload.groupName || hall.groupName,
                slots: payload.slots || hall.slots,
                floor: payload.floor || hall.floor,
                capacity: payload.capacity || hall.capacity,
                price: payload.price || hall.price || 0,
                isActive: payload.isActive,
            }
        });


        if (payload.slots && payload.slots.length > 0) {
            await this.$prisma.hallTimeSlot.deleteMany({
                where: {
                    hallId: hall.id
                }
            });
            for (const t of hall.slots) {
                await this.$prisma.hallTimeSlot.upsert({
                    where: {
                        hallId_timeSlotId: {
                            hallId: hall.id,
                            timeSlotId: t
                        }
                    },
                    create: {
                        hallId: hall.id,
                        timeSlotId: t
                    },
                    update: {
                        hallId: hall.id,
                        timeSlotId: t
                    }
                })
            }
        }

        if (payload.slots && !payload.slots.length) {
            await this.$prisma.hallTimeSlot.deleteMany({
                where: {
                    hallId: hall.id
                }
            });
        }

        return true;
    }

    async list(query: ListHallQueryDto) {
        let where: Record<string, unknown> = { isDeleted: false };
        const { page = 1, limit = 10, sortBy = 'createdAt', sort = 'desc' } = query;

        const skip = limit * page - limit;
        const take = limit;
        if (query.isActive !== undefined) where['isActive'] = query.isActive;
        if (query.search) where.OR = [
            {
                name: {
                    contains: query.search, mode: 'insensitive'

                }
            },
            {
                groupName: {
                    contains: query.search, mode: 'insensitive'

                }
            },
            {
                displayId: {
                    contains: query.search, mode: 'insensitive'
                }
            }
        ]

        const [halls, total] = await Promise.all([
            this.$prisma.hall.findMany({
                where,
                skip,
                take,
                orderBy: { [sortBy]: sort },
            }),
            this.$prisma.hall.count({ where }),
        ]);

        const slots = await this.$prisma.timeSlot.findMany({});
        const slotsFormat = slots.reduce((acc, slot) => {
            acc[slot.id] = {
                from: format24TO12(slot.from),
                to: format24TO12(slot.to),
            };
            return acc;
        }, {});

        const hallDataWithSlots = halls.map(hall => ({
            ...hall,
            slots: hall.slots.map(slotId => slotsFormat[slotId]),
        }));

        return {
            total,
            page,
            limit,
            data: hallDataWithSlots,
        };
    }
}