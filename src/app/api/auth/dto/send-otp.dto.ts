import { IsOptional, IsString } from "class-validator";

export class SendOtpPayloadDto {
    @IsString()
    phone_number: string;

    @IsString()
    @IsOptional()
    country_code: string
}


export class SendOtpResultDto {
    @IsString()
    request_id: string;
}

