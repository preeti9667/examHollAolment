import { IsString } from "class-validator";

export class SendOtp {
    @IsString()
    phoneNumber: string;

    @IsString()
    countryCode: string
}