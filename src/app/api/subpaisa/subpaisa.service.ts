import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { createCipheriv, createDecipheriv } from 'node:crypto'
import { InitPaymentRequest } from "./interfaces/init-payment";
import { EnvService } from "@app/shared/env";

@Injectable()
export class SubPaisaService {

    private algorithm = 'aes-128-cbc';
    constructor(
        private $logger: LoggerService,
        private $env: EnvService
    ) { }

    private encrypt(text: string) {
        let cipher = createCipheriv(this.algorithm, Buffer.from(this.$env.SABPAISA_AUTH_KEY), this.$env.SABPAISA_AUTH_IV);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('base64');
    }


    private decrypt(text: string) {
        let decipher = createDecipheriv(this.algorithm, Buffer.from(this.$env.SABPAISA_AUTH_KEY), this.$env.SABPAISA_AUTH_IV);
        let decrypted = decipher.update(Buffer.from(text, 'base64'));
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }


    randomStr(len: number, arr: string) {
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
        const clientTxnId = data.transactionId;
        const amount = data.amount;
        const channelId = "W";
        const transData = data.orderId;
        const stringForRequest = `payerName=${payerName}&payerEmail=${payerEmail}&payerMobile=${payerMobile}&clientTxnId=${clientTxnId}&amount=${amount}&clientCode=${this.$env.SABPAISA_CLIENT_CODE}&transUserName=${this.$env.SABPAISA_TRANS_USER_NAME}&transUserPassword=${this.$env.SABPAISA_TRANS_USER_PASSWORD}&callbackUrl=${this.$env.NEXT_PUBLIC_CALLBACK_URL}&channelId=${channelId}&mcc=${this.$env.SABPAISA_MCC}&transData=${transData}`;
        this.$logger.log("stringForRequest :: " + stringForRequest);
        const encryptedStringForRequest = this.encrypt(stringForRequest);
        this.$logger.log("encryptedStringForRequest :: " + encryptedStringForRequest);
        const formData = {
            spURL: this.$env.SABPAISA_URL,
            encData: encryptedStringForRequest,
            clientCode: this.$env.SABPAISA_CLIENT_CODE,
        };
        // const paymentUrl = `${formData.spURL}?encData=${formData.encData}&clientCode=${formData.clientCode}`;
        // this.$logger.log("paymentUrl :: " + paymentUrl);
        return formData;

    }


}
