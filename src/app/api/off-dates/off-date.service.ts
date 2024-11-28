import { PrismaService } from "@app/databases/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { AddUpdateOffDatePayloadDto } from "./dto/add-update.dto";
import { dateStringToUtc } from "src/utils";

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



    async list() {

    }
}