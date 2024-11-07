import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TimeSlotService {

    constructor(
        private $logger: LoggerService,
        private $prisma: PrismaService
    ) {

    }

    async createSlots() {
        const count = await this.$prisma.time_slot.count({});
        if (count === TIME_SLOTS.length) {
            this.$logger.log("Time slots exists already");
        }
        else {
            for (const slot of TIME_SLOTS) {
                const { from, to } = slot;
                await this.$prisma.time_slot.upsert({
                    where: { from, to },
                    update: {

                    },
                    create: { from, to }
                })
            }
        }
    }
}