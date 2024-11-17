import { EnvService } from "@app/shared/env";
import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import axios from 'axios'
import { LoggerService } from "@app/shared/logger";

@Injectable()
export class SmsService {

    private msg91Url = 'https://control.msg91.com/api/sendhttp.php';
    constructor(
        private $env: EnvService,
        private $logger: LoggerService
    ) { }
    private hashPassword(password: string): string {
        return createHash('sha1').update(password).digest('hex');
    }

    private generateHashKey(
        username: string,
        senderId: string,
        message: string,
        secureKey: string): string {
        const data = `${username}${senderId}${message}${secureKey}`;
        return createHash('sha512').update(data).digest('hex');
    }

    async sendSms(
        mobileNumber: string,
        otp: string,
        schoolCode?: string,
        templateId?: string
    ): Promise<any> {
        const messageWithVars = `Your OTP is : ${otp} for school code ${schoolCode} this will be used as your password to login in Bihar school examination board mobile application - BSEB - Bihar Government.`;
        const hashedPassword = this.hashPassword(this.$env.MAS91_PASSWORD);
        const hashKey = this.generateHashKey(
            this.$env.MSG91_USERNAME,
            this.$env.MSG91_SENDER_ID,
            messageWithVars,
            this.$env.MSG91_SECURE_KEY,
        );

        const payload = new URLSearchParams({
            username: this.$env.MSG91_USERNAME,
            password: hashedPassword,
            senderid: this.$env.MSG91_SENDER_ID,
            content: messageWithVars,
            smsservicetype: 'singlemsg',
            mobileno: mobileNumber,
            key: hashKey,
            templateid: templateId,
        });

        try {
            const response = await axios.post(
                this.msg91Url,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );
            const data = response.data;
            this.$logger.log(`Response from msg91 :: ${JSON.stringify(data)}`);
            return data;
        } catch (error) {
            this.$logger.error(error.message, error.stack);
            return false;
        }
    }
}