import { PrismaService } from "@app/databases/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { OpenId } from "src/utils";

@Injectable()
export class HallService {
    constructor(private $prisma: PrismaService) {
        this.createDummyHall();
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
}