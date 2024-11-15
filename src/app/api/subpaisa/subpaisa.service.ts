import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { logger } from "nestjs-i18n";
import { createCipheriv, createDecipheriv } from 'node:crypto'
import { InitPaymentRequest } from "./interfaces/init-payment";

@Injectable()
export class SubPaisaService {

    private algorithm = 'aes-128-cbc';
    private authKey = 'kaY9AIhuJZNvKGp2';
    private authIV = 'YN2v8qQcU3rGfA1y';
    private subPaisaApiKey = '';
    private subPaisaSecretKey = '';
    private clientCode = 'TM001';
    private transUserName = 'spuser_2013';
    private transUserPassword = 'RIADA_SP336';
    private spUrl = 'https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1';


    constructor(private $logger: LoggerService) { }

    private encrypt(text: string) {
        let cipher = createCipheriv(this.algorithm, Buffer.from(this.authKey), this.authIV);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('base64');
    }


    private decrypt(text: string) {
        let decipher = createDecipheriv(this.algorithm, Buffer.from(this.authKey), this.authIV);
        let decrypted = decipher.update(Buffer.from(text, 'base64'));
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }


    private randomStr(len: number, arr: string) {
        let ans = "";
        for (let i = len; i > 0; i--) {
            ans += arr[Math.floor(Math.random() * arr.length)];
        }
        return ans;
    }

    async initPaymentRequest(data: InitPaymentRequest) {
        const payerName = data.payerName;
        const payerEmail = data.payerEmail;
        const payerMobile = data.payerMobile;
        const clientTxnId = this.randomStr(20, "12345abcde");
        const amount = data.amount;
        const callbackUrl = "http://127.0.0.1:3000/getPgRes";
        const channelId = "W";
        const mcc = "5666";
        const transData = new Date();

        const stringForRequest =
            "payerName=" +
            payerName +
            "&payerEmail=" +
            payerEmail +
            "&payerMobile=" +
            payerMobile +
            "&clientTxnId=" +
            clientTxnId +
            "&amount=" +
            amount +
            "&clientCode=" +
            this.clientCode +
            "&transUserName=" +
            this.transUserName +
            "&transUserPassword=" +
            this.transUserPassword +
            "&callbackUrl=" +
            callbackUrl +
            "&channelId=" +
            channelId +
            "&mcc=" +
            mcc +
            "&transData=" +
            transData;

        logger.log("stringForRequest :: " + stringForRequest);
        const encryptedStringForRequest = this.encrypt(stringForRequest);
        logger.log("encryptedStringForRequest :: " + encryptedStringForRequest);
        const formData = {
            spURL: this.spUrl,
            encData: encryptedStringForRequest,
            clientCode: this.clientCode,
        };

        // Return the payment URL
        const paymentUrl = `${formData.spURL}?encData=${formData.encData}&clientCode=${formData.clientCode}`;
        return paymentUrl;

    }


}
