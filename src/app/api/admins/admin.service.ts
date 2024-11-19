import { PrismaService } from "@app/databases/prisma/prisma.service";
import { EnvService } from "@app/shared/env";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { OpenId } from "src/utils";
import { RoleService } from "../role/role.service";
import { IAuthAdmin } from "../auth/interfaces/auth-user";
import { CreateAdminPayloadDto } from "./dto/create.dto";
import { ApiException } from "../api.exception";

@Injectable()
export class AdminService {

    constructor(
        private $logger: LoggerService,
        private $prisma: PrismaService,
        private $env: EnvService,
        private $role: RoleService
    ) {
        setTimeout(() => {
            this.createAdmin();
        })
    }


    async createAdmin() {
        await this.$role.create();
        const admin = await this.$prisma.admin.findFirst({
            where: {
                countryCode: this.$env.ADMIN_COUNTRY_CODE,
                phoneNumber: this.$env.ADMIN_PHONE_NUMBER,
                email: this.$env.ADMIN_EMAIL
            }
        });

        if (admin) {
            this.$logger.log("Admin exists already");
            return;
        }

        const role = await this.$prisma.role.findFirst({
            where: {
                isSuper: true
            }
        });

        let authAdmin = await this.$prisma.auth.findFirst({
            where: {
                OR: [
                    { email: this.$env.ADMIN_EMAIL },
                    {
                        phoneNumber: this.$env.ADMIN_PHONE_NUMBER,
                        countryCode: this.$env.ADMIN_COUNTRY_CODE,
                    }
                ]
            }
        });
        if (authAdmin) {
            this.$logger.error('Admin or user already exists with these details please user another details', JSON.stringify(authAdmin));
            return;
        }
        authAdmin = await this.$prisma.auth.create({
            data: {
                email: this.$env.ADMIN_EMAIL,
                countryCode: this.$env.ADMIN_COUNTRY_CODE,
                phoneNumber: this.$env.ADMIN_PHONE_NUMBER,
                type: "ADMIN",
                roleId: role.id
            }
        })

        await this.$prisma.admin.create({
            data: {
                id: authAdmin.id,
                displayId: OpenId.create(8),
                name: this.$env.ADMIN_NAME,
                email: this.$env.ADMIN_EMAIL,
                countryCode: this.$env.ADMIN_COUNTRY_CODE,
                phoneNumber: this.$env.ADMIN_PHONE_NUMBER,
                roleId: role.id,
            }
        });


        this.$logger.log("Admin created");
    }



    async profile(admin: IAuthAdmin) {
        const adminDetails = await this.$prisma.admin.findFirst({
            where: {
                id: admin.id
            },
            select: {
                id: true,
                displayId: true,
                name: true,
                email: true,
                countryCode: true,
                phoneNumber: true
            }
        });

        return {
            ...adminDetails,
            role: admin.role
        }
    }

    async create(payload: CreateAdminPayloadDto) {

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

        if (isStaffExists) ApiException.badData('ADMIN.EXISTS');

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