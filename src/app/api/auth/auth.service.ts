import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { EnvService } from "@app/shared/env";
import { SendOtpPayloadDto } from "./dto/send-otp.dto";
import { VerifyOtpLoginPayloadDto } from "./dto/verify-otp-login.dto";
import { ApiException } from "../api.exception";
import * as moment from 'moment';
import { TokenService } from "../token/token.service";
import { OpenId } from "src/utils";
import { SMS_TEMPLATE } from "../sms/sms.constant";
import { SmsService } from "../sms/sms.service";

@Injectable()
export class AuthService {
    constructor(
        private $prisma: PrismaService,
        private $logger: LoggerService,
        private $token: TokenService,
        private $sms: SmsService,
        private $env: EnvService
    ) { }


    async sendOtp(payload: SendOtpPayloadDto) {
        const phoneNumber = payload.phone_number;
        const countryCode = payload.country_code;

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
                userId: authUser.id
            }
        });

        return {
            request_id: otpRequest.id,
            type: authUser.type
        }
    }


    async verifyOtpLogin(payload: VerifyOtpLoginPayloadDto) {
        const { request_id, otp } = payload;
        const authOtp = await this.$prisma.authOtp.findFirst({
            where: { id: request_id }
        });
        if (!authOtp) {
            ApiException.badData('AUTH.INVALID_REQUEST_ID')
        }
        if (authOtp.otp !== otp) {
            ApiException.badData('AUTH.INVALID_OTP')
        }
        const timeDifference = moment().diff(moment(authOtp.createdAt), 'minutes');
        if (timeDifference > 10) {
            ApiException.gone('AUTH.OTP_EXPIRED');
        }
        const [authUser] = await Promise.all([
            this.$prisma.auth.findFirst({ where: { id: authOtp.userId } }),
            this.$prisma.loginHistory.updateMany(
                {
                    where: { userId: authOtp.userId },
                    data: { isActive: false }
                }
            )
        ])
        const [loginHistory, user] = await Promise.all([
            this.$prisma.loginHistory.create({
                data: {
                    userId: authUser.id,
                    isActive: true
                }
            }),
            this.$prisma.user.upsert({
                where: { id: authUser.id },
                update: {
                    email: authUser.email,
                    phoneNumber: authUser.phoneNumber,
                    countryCode: authUser.countryCode,
                    isActive: authUser.isActive,
                    isDeleted: authUser.isDeleted
                },
                create: {
                    id: authUser.id,
                    email: authUser.email,
                    displayId: OpenId.format('USR', 6),
                    phoneNumber: authUser.phoneNumber,
                    countryCode: authUser.countryCode,
                    isActive: authUser.isActive,
                    isDeleted: authUser.isDeleted
                }
            }),
            this.$prisma.authOtp.delete({ where: { id: request_id } })
        ]);

        const jwtPayload = {
            tid: loginHistory.id,
            type: authUser.type
        }
        const accessToken = await this.$token.createAccessToken(jwtPayload);

        return {
            accessToken,
            type: authUser.type,
            user: {
                id: user.id,
                name: user.name
            }
        }

    }


    async veryAccessToken(token: string) {
        const decoded = await this.$token.decodeToken(token);
        const { tid } = decoded;
        const user = await this.$prisma.loginHistory.findFirst({
            where: {
                id: tid,
                isActive: true
            },
            select: {
                authUser: {
                    where: {
                        isDeleted: false
                    }
                }
            }
        })

        if (!user) ApiException.unAuthorized();
        const { id, isActive, phoneNumber, countryCode, email, type } = user.authUser;
        if (decoded.type !== type) ApiException.unAuthorized();
        if (!isActive) ApiException.unAuthorized("AUTH.ACCOUNT_DEACTIVATED");

        return {
            id,
            phoneNumber,
            countryCode,
            email,
            type
        }
    }
}