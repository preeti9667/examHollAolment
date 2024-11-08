import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { EnvService } from "@app/shared/env";
import { SendOtpPayloadDto } from "./dto/send-otp.dto";
import { VerifyOtpLoginPayloadDto } from "./dto/verify-otp-login.dto";
import { ApiException } from "../api.exception";
import * as moment from 'moment';
import { TokenService } from "../token/token.service";
import { TokenDecoded } from "../token/interfaces/token-decoded";

@Injectable()
export class AuthService {
    constructor(
        private $prisma: PrismaService,
        private $logger: LoggerService,
        private $env: EnvService,
        private $token: TokenService
    ) { }


    async sendOtp(payload: SendOtpPayloadDto) {
        const { country_code = '+91', phone_number } = payload;
        let authUser = await this.$prisma.auth.findFirst({
            where: {
                phone_number,
                country_code
            }
        });

        if (!authUser) {
            authUser = await this.$prisma.auth.create({
                data: {
                    phone_number,
                    country_code
                }
            });
        }

        let otp = this.$env.BYPASS_OTP;
        if (!otp) {
            //generate otp
        }

        await this.$prisma.auth_otp.deleteMany({ where: { user_id: authUser.id } })
        const otpRequest = await this.$prisma.auth_otp.create({
            data: {
                phone_number,
                country_code,
                otp,
                user_id: authUser.id
            }
        });

        return {
            request_id: otpRequest.id,
            type: authUser.type
        }
    }


    async verifyOtpLogin(payload: VerifyOtpLoginPayloadDto) {
        const { request_id, otp } = payload;
        const authOtp = await this.$prisma.auth_otp.findFirst({
            where: { id: request_id }
        });
        if (!authOtp) {
            ApiException.badData('AUTH.INVALID_REQUEST_ID')
        }
        if (authOtp.otp !== otp) {
            ApiException.badData('AUTH.INVALID_OTP')
        }
        const timeDifference = moment().diff(moment(authOtp.created_at), 'minutes');
        if (timeDifference > 10) {
            ApiException.gone('AUTH.OTP_EXPIRED');
        }
        const [authUser] = await Promise.all([
            this.$prisma.auth.findFirst({ where: { id: authOtp.user_id } }),
            this.$prisma.login_history.updateMany({ where: { user_id: authOtp.user_id }, data: { isActive: false } })
        ])
        const [loginHistory, user] = await Promise.all([
            this.$prisma.login_history.create({
                data: {
                    user_id: authUser.id,
                    isActive: true
                }
            }),
            this.$prisma.user.upsert({
                where: { id: authUser.id },
                update: {
                    email: authUser.email,
                    phone_number: authUser.phone_number,
                    country_code: authUser.country_code,
                    isActive: authUser.isActive,
                    isDeleted: authUser.isDeleted
                },
                create: {
                    id: authUser.id,
                    email: authUser.email,
                    phone_number: authUser.phone_number,
                    country_code: authUser.country_code,
                    isActive: authUser.isActive,
                    isDeleted: authUser.isDeleted
                }
            }),
            this.$prisma.auth_otp.delete({ where: { id: request_id } })
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
        const { tid, type } = decoded;
        const loginHistory = await this.$prisma.login_history.findFirst({
            where: {
                id: tid,
                isActive: true
            },
            select: {
                auth_user: true
            }
        })
    }
}