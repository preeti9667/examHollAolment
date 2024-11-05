import nanoid = require('nanoid');

export class OpenId {
    static create(len: number) {
        return nanoid.customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', len)();
    }
    static format(prefix: string, len = 10) {
        return `${prefix}-${this.create(len)}`;
    }

    static otp(len = 4) {
        return nanoid.customAlphabet('0123456789', len)();
    }
}
