import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { SendOtpPayloadDto } from "../dto/send-otp.dto";
import { ApiException } from "@app/api/api.exception";
import { EnvService } from "@app/shared/env";

@Injectable()
export class AuthService {
    constructor(
        private $prisma: PrismaService,
        private $logger: LoggerService,
        private $env: EnvService
    ) { }


    async sendOtp(payload: SendOtpPayloadDto) {
        const { country_code = '+91', phone_number } = payload;
        let user = await this.$prisma.user.findFirst({
            where: {
                phone_number,
                country_code
            }
        });

        if (!user) {
            user = await this.$prisma.user.create({
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

        const otpRequest = await this.$prisma.auth_otp.create({
            data: {
                phone_number,
                country_code,
                otp,
                user_id: user.id
            }
        });

        return {
            request_id: otpRequest.id
        }
    }
}