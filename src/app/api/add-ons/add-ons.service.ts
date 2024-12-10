import { PrismaService } from "@app/databases/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { dateStringToUtc, format24TO12, OpenId } from "src/utils";
import { ApiException } from "../api.exception";
import { CreateAddOnsDto } from "./dto/create.dto";
import { LoggerService } from "@app/shared/logger";
import { ListAddOnsQueryDto } from "./dto/list.dto";
import { EditAddOnsDto } from "./dto/edit.dto";
import { add } from "winston";

@Injectable()
export class AddOnsService {
    constructor(
        private $prisma: PrismaService,
        private $logger: LoggerService
    ) { }

    async create(payload: CreateAddOnsDto) {
        await this.$prisma.addOn.create({
            data: {
                displayId: OpenId.format('AO'),
                ...payload
            }
        })
        return true;
    }

    async edit(payload: EditAddOnsDto, id: string) {
        const addOn = await this.$prisma.addOn.findFirst({
            where: {
                id
            }
        });
        if (!addOn) ApiException.badData('ADD_ON.NOT_FOUND');

        await this.$prisma.addOn.update({
            where: { id },
            data: {
                ...payload
            }
        })
        return true;
    }

    async list(query: ListAddOnsQueryDto) {
        let where: Record<string, unknown> = {};
        const { page = 1, limit = 10, sortBy = 'createdAt', sort = 'desc' } = query;

        const skip = limit * page - limit;
        const take = limit;

        if (query.isActive !== undefined) where['isActive'] = query.isActive;

        const [data, total] = await Promise.all([
            this.$prisma.addOn.findMany({
                where,
                skip,
                take,
                orderBy: { [sortBy]: sort },
            }),
            this.$prisma.addOn.count({ where }),
        ]);

        return {
            total,
            page,
            limit,
            data,
        };
    }


    async listForCustomer() {
        const data = await this.$prisma.addOn.findMany({
            where: {
                isActive: true,
                isDeleted: false
            },
            select: {
                id: true,
                name: true,
                price: true,
                displayId: true,
            }
        });

        return data;
    }



    async details(id: string) {
        const addOn = await this.$prisma.addOn.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                price: true,
                displayId: true,
                type: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return addOn;
    }
}