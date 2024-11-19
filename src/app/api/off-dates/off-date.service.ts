import { PrismaService } from "@app/databases/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { AddUpdateOffDatePayloadDto } from "./dto/add-update.dto";
import { dateStringToUtc } from "src/utils";

@Injectable()
export class OffDateService {

    constructor(private $prisma: PrismaService) { }


    async addUpdate(payload: AddUpdateOffDatePayloadDto) {
        const dates = [];

        for (const date of payload.dates) {
            date.slots.forEach(slot => {
                dates.push({
                    date: dateStringToUtc(date.date),
                    timeSlotId: slot
                })
            })
        }

        await this.$prisma.offDate.deleteMany({});
        await this.$prisma.offDate.createMany({
            data: dates
        });
    }



    async list() {
        const result = await this.$prisma.offDate.findMany({
            select: {
                date: true,
                timeSlot: {
                    select: {
                        from: true,
                        to: true
                    }
                }
            }
        });

        return result;
    }
}