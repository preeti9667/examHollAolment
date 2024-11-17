import { PrismaService } from "@app/databases/prisma/prisma.service";
import { EnvService } from "@app/shared/env";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { OpenId } from "src/utils";
import { RoleService } from "../role/role.service";

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
}