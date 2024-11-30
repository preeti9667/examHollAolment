import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { UpdateProfilePayloadDto, UpdateProfileResultDto } from "./dto/update-profile.dto";
import { PrismaService } from "@app/databases/prisma/prisma.service";
import { OpenId } from "src/utils";
import { add } from "winston";
import { UserListQueryDto } from "./dto/list.dto";

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


    async list(
        payload: UserListQueryDto
    ) {

        const { page = 1, limit = 10, sort = 'desc', sortBy = 'createdAt', search, isActive } = payload;
        const where: any = {};
        const skip = (page - 1) * limit;

        if (isActive !== undefined) where.isActive = isActive;
        if (search) where.OR = [
            {
                name: { contains: search, mode: 'insensitive' }
            },
            {
                email: { contains: search, mode: 'insensitive' }
            },
            {
                phoneNumber: { contains: search, mode: 'insensitive' }
            },
            {
                displayId: { contains: search, mode: 'insensitive' }
            }
        ]

        const [total, data] = await Promise.all([
            this.$prisma.user.count({ where }),
            this.$prisma.user.findMany({
                where,
                orderBy: {
                    [sortBy]: sort
                },
                skip,
                take: limit,
                select: {
                    id: true,
                    displayId: true,
                    bio: true,
                    gstNo: true,
                    jobTitle: true,
                    organizationName: true,
                    name: true,
                    email: true,
                    countryCode: true,
                    phoneNumber: true,
                    createdAt: true,
                    updatedAt: true,
                    address: {
                        select: {
                            id: true,
                            street: true,
                            addressLine: true,
                            pincode: true,
                            city: true,
                            state: true
                        }
                    }
                }
            })
        ])

        return {
            total,
            page,
            limit,
            data
        }
    }

}