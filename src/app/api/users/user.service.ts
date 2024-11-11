import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { UpdateProfilePayloadDto, UpdateProfileResultDto } from "./dto/update-profile.dto";
import { PrismaService } from "@app/databases/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(
        private $logger: LoggerService,
        private $prisma: PrismaService,
    ) {


    }

    list() {
        this.$logger.log("checking");
        return [{ name: 'user' }];
    }


    async updateProfile(payload: UpdateProfilePayloadDto, userId: string): Promise<UpdateProfileResultDto> {
        const profile = await this.$prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: payload.name,
                bio: payload.bio,
                gstNo: payload.gstNo
            }
        })

        let address = await this.$prisma.userAddress.findFirst({
            where: {
                userId
            }
        });

        if (address) {
            await this.$prisma.userAddress.update({
                where: {
                    id: address.id
                },
                data: {
                    ...payload.address
                }
            })
        }
        else {
            await this.$prisma.userAddress.create({
                data: {
                    ...payload.address,
                    userId
                }
            });
        }


        return {
            id: profile.id,
            name: profile.name,
            bio: profile.bio,
            displayId: profile.displayId,
            gstNo: profile.gstNo,
            address: {
                ...payload.address
            }
        }
    }

}