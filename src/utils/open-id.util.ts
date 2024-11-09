
export class OpenId {

    private static generate(characters: string, len: number) {
        let result = '';
        for (let i = 0; i < len; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    static create(len: number = 6) {
        const characters = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Capital letters only
        return this.generate(characters, len)
    }
    static format(prefix: string, len = 10) {
        return `${prefix}-${this.create(len)}`;
    }

    static otp(len = 4) {
        return this.generate('0123456789', len);
    }
}
