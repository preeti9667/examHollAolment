import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";
import { createCipheriv, createDecipheriv } from 'node:crypto'

@Injectable()
export class SubPaisaService {

    private algorithm = 'aes-128-cbc';
    private authKey = 'authkey';
    private authIV = 'authIv';
    private subPaisaApiKey = '';
    private subPaisaSecretKey = '';
    constructor(private $logger: LoggerService) { }

    encrypt(text: string) {
        let cipher = createCipheriv(this.algorithm, Buffer.from(this.authKey), this.authIV);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('base64');
    }


    decrypt(text: string) {
        let decipher = createDecipheriv(this.algorithm, Buffer.from(this.authKey), this.authIV);
        let decrypted = decipher.update(Buffer.from(text, 'base64'));
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }


}
