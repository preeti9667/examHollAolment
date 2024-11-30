import { PrismaService } from "@app/databases/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { AddUpdateOffDatePayloadDto } from "./dto/add-update.dto";
import { dateStringToUtc, utcToDateString } from "src/utils";
import { OffDateListQueryDto } from "./dto/list.dto";

@Injectable()
export class OffDateService {

    constructor(private $prisma: PrismaService) { }


    async addUpdate(payload: AddUpdateOffDatePayloadDto) {
        for (const date of payload.dates) {
            for (const slot of date.slots) {
                const isExists = await this.$prisma.offDate.findFirst({
                    where: {
                        timeSlotId: slot,
                        date: dateStringToUtc(date.date)
                    }
                })
                if (isExists) {
                    await this.$prisma.offDate.update({
                        where: { id: isExists.id },
                        data: {
                            date: dateStringToUtc(date.date),
                            timeSlotId: slot,
                            offType: date.offType,
                            description: date.description
                        }
                    })

                }
                else {
                    await this.$prisma.offDate.create({
                        data: {
                            date: dateStringToUtc(date.date),
                            timeSlotId: slot,
                            offType: date.offType,
                            description: date.description
                        }
                    })
                }
            }
        }

    }



    async list(payload: OffDateListQueryDto) {
        const { page = 1, limit = 10, search, sortBy, sort } = payload;

        const where = {} as any;
        if (search) {
            where.OR = [
                { description: { contains: search, mode: 'insensitive' } },
                { offType: { contains: search, mode: 'insensitive' } },
            ]
        }

        const list = await this.$prisma.offDate.findMany({
            where,
            select: {
                date: true,
                offType: true,
                description: true,
                timeSlotId: true,
                timeSlot: {
                    select: {
                        id: true,
                        from: true,
                        to: true
                    }
                },
                createdAt: true
            },
            orderBy: {
                [sortBy]: sort
            }
        });

        const dateObj = {} as any;
        for (const item of list) {
            const date = utcToDateString(item.date);
            if (!dateObj[date]) {
                dateObj[date] = {
                    date,
                    offType: item.offType,
                    description: item.description,
                    createdAt: item.createdAt,
                    slots: [item.timeSlot]
                }
            } else {
                dateObj[date].slots.push(item.timeSlot);
            }
        }

        const total = Object.values(dateObj).length;
        const data = [];

        Object.values(dateObj).forEach((item, index) => {
            if (index >= (page - 1) * limit && index < page * limit) {
                data.push(item);
            }
        })

        return {
            total,
            page,
            limit,
            data
        }
    }
}