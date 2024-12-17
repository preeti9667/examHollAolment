import { PrismaService } from "@app/databases/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { SETTINGS } from "./setting.constant";

@Injectable()
export class SettingService {

    constructor(
        private $prisma: PrismaService
    ) {

        setTimeout(() => {
            this.init();
        }, 1000)
    }

    async init() {
        const isExists = await this.$prisma.settings.findFirst();
        if (isExists) return;
        await this.$prisma.settings.create({
            data: {
                pricePerSeat: SETTINGS.pricePerSeat,
                securityDeposit: SETTINGS.securityDeposit,
            }
        })
    }

    async get() {
        return await this.$prisma.settings.findFirst({
            select: {
                pricePerSeat: true,
                securityDeposit: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }






}