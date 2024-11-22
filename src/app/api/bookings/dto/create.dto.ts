import { ResponseDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEAN, IsEnum, IsNumber, IsObject, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
import { BookingStatus } from "../booking.constant";
import { IsBpDateFormat } from "@app/decorators/date-validator.decorator";


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

export class BookingDateTimeSlotDto {
    @ApiProperty({
        type: String,
        example: '2024-11-09'
    })
    @IsBpDateFormat()
    date: string;

    @ApiProperty({
        type: String,
        description: 'time slot id',
        example: '1b53c972-bdc7-4cfb-bf86-90a55e8b95ae'
    })
    @IsString()
    @IsUUID()
    slotId: string;

    @ApiProperty({
        type: Number,
        example: 1000
    })
    @IsNumber()
    noOfCandidates: number;
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
    @ValidateIf((obj) => obj.status === BookingStatus.AwaitingForPayment)
    @IsBpDateFormat()
    startDate: string;

    @ApiProperty({
        type: String,
        example: "2024-11-19"
    })
    @ValidateIf((obj) => obj.status === BookingStatus.AwaitingForPayment)
    @IsBpDateFormat()
    endDate: string;

    @ApiProperty({
        type: Number,
        example: 1011
    })
    @IsNumber()
    @IsOptional()
    noOfCandidates: number;


    @ApiProperty({
        type: String,
        description: "GST no for booking",
    })
    @IsOptional()
    @IsString()
    gstNo: string


    @ApiProperty({
        type: Number,
        enum: [BookingStatus.Draft, BookingStatus.AwaitingForPayment],
        example: BookingStatus.Draft
    })
    @IsNumber()
    @IsEnum([BookingStatus.Draft, BookingStatus.AwaitingForPayment])
    status: number;


    @ApiProperty({
        type: BookingAddressDto,
        required: true,
    })
    @IsObject()
    @Type(() => BookingAddressDto)
    address: BookingAddressDto

    @ApiProperty({
        type: [BookingDateTimeSlotDto],
        required: false,
    })
    @ValidateIf((obj) => obj.status === BookingStatus.AwaitingForPayment)
    @IsArray()
    // @IsOptional()
    @Type(() => BookingDateTimeSlotDto)
    timeSlots: BookingDateTimeSlotDto[]
}


export class CreateBookingResultDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    displayId: string;

    @ApiProperty({
        type: String,
        required: false
    })
    @IsString()
    @IsOptional()
    paymentLink: string;

    @ApiProperty({
        type: Number,
        enum: BookingStatus,
        example: BookingStatus.Draft
    })
    @IsNumber()
    @IsEnum(BookingStatus)
    status: number;
}


export class CreateBookingResponseDto extends ResponseDto {
    @ApiProperty({
        type: CreateBookingResultDto
    })
    @IsObject()
    @Type(() => CreateBookingResultDto)
    result: CreateBookingResultDto;
}