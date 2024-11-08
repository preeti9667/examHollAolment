import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { TIME_SLOTS } from "./time-slot.contant";

@Injectable()
export class TimeSlotService {

    constructor(
        private $logger: LoggerService,
        private $prisma: PrismaService
    ) {
        this.createSlots();
    }

    async createSlots() {
        try {
            const count = await this.$prisma.time_slot.count({});
            if (count === TIME_SLOTS.length) {
                this.$logger.log("Time slots exists already");
            }
            else {
                for (const slot of TIME_SLOTS) {
                    const { from, to } = slot;
                    const slotExist = await this.$prisma.time_slot.findFirst({ where: { from, to } });
                    if (slotExist) {
                        this.$logger.log(`Slot exists : ${[from, to]}`)
                    } else {
                        await this.$prisma.time_slot.create({ data: { from, to } });
                        this.$logger.log(`Slot created : ${[from, to]}`)
                    }
                }
            }
        } catch (error) {
            this.$logger.error(error.message, error.stack);
        }
    }


    async slotList() {
        const slots = await this.$prisma.time_slot.findMany({});
        return { slots }
    }
}