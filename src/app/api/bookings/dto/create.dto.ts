import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateBookingPayloadDto {
    @ApiProperty({
        type: String,
        example: 'The new School'
    })
    @IsString()
    organizationName: string;

    @ApiProperty({
        type: String,
        example: 'JTR'
    })
    @IsString()
    institutionType: string;

    @ApiProperty({
        type: String,
        example: 'saini dev'
    })
    @IsString()
    applicantName: string;

    @ApiProperty({
        type: String,
        example: 'abc@gmail.com'
    })
    @IsString()
    email: string;

    @ApiProperty({
        type: String,
        example: '98878888'
    })
    @IsString()
    phoneNumber: string;

    @ApiProperty({
        type: String,
        example: '+91',
        default: '+91'
    })
    @IsString()
    countryCode: string;

    @ApiProperty({
        type: String,
        example: 'The Selection Exam',
    })
    @IsString()
    examName: string;

    @ApiProperty({
        type: String,
        example: "2024-11-09"
    })
    @IsString()
    @IsOptional()
    startDate: Date;

    @ApiProperty({
        type: String,
        example: "2024-11-19"
    })
    @IsString()
    @IsOptional()
    endDate: Date;

    @ApiProperty({
        type: Number,
        example: 1011
    })
    @IsString()
    @IsOptional()
    noOfCandidates: number;


    @ApiProperty({
        type: String,
        description: "Time  Slots Ids"
    })
    @IsOptional()
    @IsArray()
    @IsString()
    timeSlotIds: string[]

}