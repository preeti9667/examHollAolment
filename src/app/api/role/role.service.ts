import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { PERMISSIONS, ROLES } from "./role.constant";
import { OpenId } from "src/utils";

@Injectable()
export class RoleService {
    constructor(
        private $logger: LoggerService,
        private $prisma: PrismaService
    ) {

    }

    async create() {
        const roleCount = await this.$prisma.role.count({});
        if (roleCount === ROLES.length) {

            const superAdmin = await this.$prisma.role.findFirst({ where: { isSuper: true } });
            if (JSON.stringify(superAdmin.permissions) !== JSON.stringify(PERMISSIONS)) {
                await this.$prisma.role.update({
                    where: {
                        id: superAdmin.id
                    },
                    data: {
                        permissions: {
                            set: PERMISSIONS
                        }
                    }
                });

                this.$logger.log("Permissions updated to super admin");
            }
            this.$logger.log("Roles exists already");
            return;
        }

        for (const role of ROLES) {
            await this.$prisma.role.upsert({
                where: {
                    id: role.id
                },
                update: {
                    name: role.name,
                    isSuper: role.isSuper,
                    permissions: {
                        set: role.permissions
                    }
                },
                create: {
                    name: role.name,
                    displayId: OpenId.format('ROLE', 6),
                    id: role.id,
                    isSuper: role.isSuper,
                    permissions: role.permissions
                }
            })
        }
        this.$logger.log("Roles created");
    }
}