import { PrismaService } from "@app/databases/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { SETTINGS } from "./setting.constant";
import { SettingsPayloadDto } from "./dto/settings.dto";

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


    async update(payload: SettingsPayloadDto) {
        let isExists = await this.$prisma.settings.findFirst();
        if (isExists) {
            isExists = await this.$prisma.settings.update({
                where: {
                    id: isExists.id
                },
                data: {
                    pricePerSeat: payload.pricePerSeat,
                    securityDeposit: payload.securityDeposit,
                }
            });
        }
        else {
            isExists = await this.$prisma.settings.create({
                data: {
                    pricePerSeat: payload.pricePerSeat,
                    securityDeposit: payload.securityDeposit,
                }
            });
        }

        return {
            pricePerSeat: isExists.pricePerSeat,
            securityDeposit: isExists.securityDeposit,
            createdAt: isExists.createdAt,
            updatedAt: isExists.updatedAt
        }

    }



}