import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { UpdateProfilePayloadDto, UpdateProfileResultDto } from "./dto/update-profile.dto";
import { PrismaService } from "@app/databases/prisma/prisma.service";
import { OpenId } from "src/utils";
import { add } from "winston";

@Injectable()
export class UserService {
    constructor(
        private $logger: LoggerService,
        private $prisma: PrismaService,
    ) {

    }


    async updateProfile(payload: UpdateProfilePayloadDto, userId: string): Promise<UpdateProfileResultDto> {
        const profile = await this.$prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: payload.name,
                bio: payload.bio,
                gstNo: payload.gstNo,
                jobTitle: payload.jobTitle,
                organizationName: payload.organizationName,
                email: payload.email
            }
        })

        let address = await this.$prisma.userAddress.findFirst({
            where: {
                userId
            }
        });

        if (address) {
            address = await this.$prisma.userAddress.update({
                where: {
                    id: address.id
                },
                data: {
                    ...payload.address
                }
            })
        }
        else {
            address = await this.$prisma.userAddress.create({
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
            phoneNumber: profile.phoneNumber,
            countryCode: profile.countryCode,
            email: profile.email,
            gstNo: profile.gstNo,
            organizationName: profile.organizationName,
            jobTitle: profile.jobTitle,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
            address: {
                id: address.id,
                ...payload.address
            }
        }
    }


    async details(userId: string) {
        const profile = await this.$prisma.user.findFirst({
            where: {
                id: userId
            },
            include: {
                address: {
                    select: {
                        id: true,
                        street: true,
                        addressLine: true,
                        pincode: true,
                        city: true,
                        state: true,
                    }
                }
            }
        })

        return {
            id: profile.id,
            name: profile.name,
            bio: profile.bio,
            displayId: profile.displayId,
            phoneNumber: profile.phoneNumber,
            countryCode: profile.countryCode,
            email: profile.email,
            gstNo: profile.gstNo,
            organizationName: profile.organizationName,
            jobTitle: profile.jobTitle,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
            address: profile.address[0]
        }
    }

}