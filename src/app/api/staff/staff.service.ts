import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { CreateStaffPayloadDto } from "./dto/create.dto";
import { OpenId } from "src/utils";
import { ApiException } from "../api.exception";

@Injectable()
export class StaffService {

    constructor(
        private $logger: LoggerService,
        private $prisma: PrismaService
    ) { }


    async create(payload: CreateStaffPayloadDto) {

        const role = await this.$prisma.role.findFirst({
            where: {
                name: 'STAFF'
            }
        });

        const { countryCode = '+91', phoneNumber, email, name } = payload;
        const isStaffExists = await this.$prisma.admin.findFirst({
            where: {
                OR: [
                    {
                        email
                    },
                    {
                        countryCode,
                        phoneNumber
                    }
                ]
            }
        });

        if (isStaffExists) ApiException.badData('STAFF.EXISTS');

        const staff = await this.$prisma.admin.create({
            data: {
                displayId: OpenId.create(8),
                roleId: role.id,
                countryCode,
                email,
                name,
                phoneNumber
            }
        });

        return {
            id: staff.id,
            displayId: staff.displayId,
            name: staff.name,
            countryCode: staff.countryCode,
            phoneNumber: staff.phoneNumber,
            email: staff.email,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt
        }
    }
}