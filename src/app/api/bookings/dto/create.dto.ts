import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEAN, IsEnum, IsNumber, IsObject, IsOptional, IsString } from "class-validator";


export class BookingAddressDto {
    @ApiProperty({
        type: String,
        example: '25',
        required: false
    })
    @IsOptional()
    @IsString()
    houseNo?: string

    @ApiProperty({
        type: String,
        example: 'gali no 10',
        required: false
    })
    @IsOptional()
    @IsString()
    street?: string;

    @ApiProperty({
        type: String,
        example: '232, F block, sector',
        required: true
    })
    @IsOptional()
    @IsString()
    addressLine?: string;

    @ApiProperty({
        type: String,
        example: '342900',
        required: true
    })
    @IsString()
    pincode: string;

    @ApiProperty({
        type: String,
        example: 'Noida',
        required: true
    })
    @IsString()
    city: string;

    @ApiProperty({
        type: String,
        example: 'Uttar Pradesh',
        required: true
    })
    @IsString()
    state: string
}
export class CreateBookingPayloadDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
        description: "send if going to booking a draft booking"
    })
    @IsOptional()
    @IsString()
    id?: string;

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
    @IsString()
    timeSlotId: string


    @ApiProperty({
        type: Number,
        enum: BookingStatus,
        example: BookingStatus.Booked
    })
    @IsNumber()
    @IsEnum(BookingStatus)
    status: number;


    @ApiProperty({
        type: BookingAddressDto,
        required: true,
    })
    @IsObject()
    @Type(() => BookingAddressDto)
    address: BookingAddressDto
}