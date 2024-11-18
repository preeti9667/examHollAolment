import { EnvService } from "@app/shared/env";
import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import axios from 'axios'
import { LoggerService } from "@app/shared/logger";

@Injectable()
export class SmsService {

    private msg91Url = 'https://msdgweb.mgov.gov.in/esms/sendsmsrequestDLT';
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
        template: {
            id: string,
            name: string,
            message: string
        },
        variables: { [key: string]: string }[]
    ): Promise<any> {

        let messageWithVars = template.message;
        variables.forEach((variable) => {
            Object.keys(variable).forEach((key) => {
                messageWithVars = messageWithVars.replace(`$${key}`, variable[key]);
            })
        });
        const hashedPassword = this.hashPassword(this.$env.MSD_PASSWORD);
        const hashKey = this.generateHashKey(
            this.$env.MSD_USERNAME,
            this.$env.MSD_SENDER_ID,
            messageWithVars,
            this.$env.MSD_SECURE_KEY,
        );

        const payload = new URLSearchParams({
            username: this.$env.MSD_USERNAME,
            password: hashedPassword,
            senderid: this.$env.MSD_SENDER_ID,
            content: messageWithVars,
            smsservicetype: 'singlemsg',
            mobileno: mobileNumber,
            key: hashKey,
            templateid: template.id,
        });

        try {
            const response = await axios.post(
                this.msg91Url,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    proxy: {
                        protocol: "http",
                        host: 'velodrome.usefixie.com',
                        port: 80,
                        auth: {
                            username: 'fixie',
                            password: 'ZVKhV0Ushry8aHs'
                        }
                    },
                },
            );
            const data = response.data;
            this.$logger.log(`Response from MSD :: ${JSON.stringify(data)}`);
            return data;
        } catch (error) {
            this.$logger.error(error.message, error.stack);
            return false;
        }
    }
}