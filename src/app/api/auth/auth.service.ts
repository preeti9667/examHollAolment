import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { EnvService } from "@app/shared/env";
import { SendOtpPayloadDto } from "./dto/send-otp.dto";
import { VerifyOtpPayloadDto } from "./dto/verify-otp.dto";
import { ApiException } from "../api.exception";
import * as moment from 'moment';

@Injectable()
export class AuthService {
    constructor(
        private $prisma: PrismaService,
        private $logger: LoggerService,
        private $env: EnvService
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


    async verifyOtpLogin(payload: VerifyOtpPayloadDto) {
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



    }
}