import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { UpdateProfilePayloadDto, UpdateProfileResultDto } from "./dto/update-profile.dto";
import { PrismaService } from "@app/databases/prisma/prisma.service";
import { OpenId } from "src/utils";
import { add } from "winston";
import { UserListQueryDto } from "./dto/list.dto";
import { EnvService } from "@app/shared/env";
import { SmsService } from "../sms/sms.service";
import { SMS_TEMPLATE } from "../sms/sms.constant";
import { CreateUserPayloadDto } from "./dto/create.dto";

@Injectable()
export class UserService {
    constructor(
        private $logger: LoggerService,
        private $prisma: PrismaService,
        private $env: EnvService,
        private $sms: SmsService
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
                email: payload.email,
                institutionType: payload.institutionType
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
            institutionType: profile.institutionType,
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
            institutionType: profile.institutionType,
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
                    institutionType: true,
                    isActive: true,
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

    /** create user by admin */
    async create(payload: CreateUserPayloadDto) {
        const phoneNumber = payload.phoneNumber;
        const countryCode = payload.countryCode;

        let authUser = await this.$prisma.auth.findFirst({
            where: {
                phoneNumber,
                countryCode
            }
        });

        if (!authUser) {
            authUser = await this.$prisma.auth.create({
                data: {
                    phoneNumber,
                    countryCode
                }
            });
        }

        let otp = this.$env.BYPASS_OTP;
        if (!otp) {
            otp = OpenId.otp(6);
            await this.$sms.sendSms(
                phoneNumber,
                SMS_TEMPLATE.loginOtp,
                [{ otp }],
            );
        }

        await this.$prisma.authOtp.deleteMany({ where: { userId: authUser.id } })
        const otpRequest = await this.$prisma.authOtp.create({
            data: {
                phoneNumber,
                countryCode,
                otp,
                userId: authUser.id,
                profile: {
                    ...payload
                }
            }
        });

        return {
            requestId: otpRequest.id,
            type: authUser.type
        }
    }


}