import { PrismaService } from "@app/databases/prisma/prisma.service";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { SETTINGS } from "./setting.constant";
import { SettingsPayloadDto } from "./dto/settings.dto";
import { ISetting } from "./interfaces/settings";

@Injectable()
export class SettingService implements OnModuleInit {

    settings: ISetting;
    constructor(
        private $prisma: PrismaService
    ) {
    }
    async onModuleInit() {
        await this.init();
        const settings = await this.$prisma.settings.findFirst({
            select: {
                pricePerSeat: true,
                securityDeposit: true
            }
        });

        this.settings = {
            pricePerSeat: settings.pricePerSeat,
            securityDeposit: settings.securityDeposit
        };
    }

    async init() {
        const isExists = await this.$prisma.settings.findFirst();
        if (isExists) return;
        await this.$prisma.settings.create({
            data: {
                pricePerSeat: SETTINGS.pricePerSeat,
                securityDeposit: SETTINGS.securityDeposit,
                history: []
            }
        });
        return {
            pricePerSeat: SETTINGS.pricePerSeat,
            securityDeposit: SETTINGS.securityDeposit
        }
    }

    async details() {
        return await this.$prisma.settings.findFirst({
            select: {
                pricePerSeat: true,
                securityDeposit: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }


    async update(payload: SettingsPayloadDto, adminId: string) {
        let isExists = await this.$prisma.settings.findFirst();
        let history = [];
        if (isExists.history) {
            history = isExists.history as object[];
            history.push({
                adminId,
                pricePerSeat: payload.pricePerSeat,
                securityDeposit: payload.securityDeposit,
                updatedAt: new Date()
            })
        }
        if (isExists) {
            isExists = await this.$prisma.settings.update({
                where: {
                    id: isExists.id
                },
                data: {
                    pricePerSeat: payload.pricePerSeat,
                    securityDeposit: payload.securityDeposit,
                    history
                }
            });
        }
        else {
            isExists = await this.$prisma.settings.create({
                data: {
                    pricePerSeat: payload.pricePerSeat,
                    securityDeposit: payload.securityDeposit,
                    history
                }
            });
        }

        this.settings = {
            pricePerSeat: payload.pricePerSeat,
            securityDeposit: payload.securityDeposit
        };

        return {
            pricePerSeat: isExists.pricePerSeat,
            securityDeposit: isExists.securityDeposit,
            createdAt: isExists.createdAt,
            updatedAt: isExists.updatedAt
        }

    }





}