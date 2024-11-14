import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsString, IsOptional, IsNumber, IsEnum, IsDate, IsObject, IsInt, ValidateNested, Length } from "class-validator";
import { BookingStatus } from "../booking.constant";
import { Format24TO12, UtcToDateString } from "src/utils";
import { Type } from "class-transformer";
import { ResponseDto } from "@app/api/response.dto";


export class BookingDetailParamsDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
    })
    @IsUUID()
    id: string;
}


export class BookingDetailsHallDto {
    @ApiProperty({
        description: 'The unique identifier of the hall.',
        example: '13890811-23b6-409f-a753-7adedd90f2cf'
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: 'The name of the hall.',
        example: 'Hall 9'
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The seating capacity of the hall.',
        example: 250
    })
    @IsInt()
    capacity: number;

    @ApiProperty({
        description: 'The display ID for the hall.',
        example: '93EVHU8B'
    })
    @IsString()
    displayId: string;

    @ApiProperty({
        description: 'The group name that this hall belongs to.',
        example: 'Group c'
    })
    @IsString()
    groupName: string;
}


export class BookingDetailsSlotDto {
    @ApiProperty({
        description: 'The unique identifier of the slot.',
        example: '1b53c972-bdc7-4cfb-bf86-90a55e8b95ae'
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: 'The start time of the slot.',
        example: '09:00 AM'
    })
    @Format24TO12()
    from: number;

    @ApiProperty({
        description: 'The end time of the slot.',
        example: '12:00 PM'
    })
    @Format24TO12()
    @IsString()
    to: number;
}


export class BookingDetailsAddressDto {
    @ApiProperty({
        type: String,
        example: 'gali no 10',
        required: false
    })
    street?: string;

    @ApiProperty({
        type: String,
        example: '232, F block, sector 51',
        required: false
    })
    @IsString()
    @IsOptional()
    addressLine?: string;

    @ApiProperty({
        type: String,
        example: '301203',
        required: true
    })
    @IsString()
    @Length(6, 6)
    pincode: string;

    @ApiProperty({
        type: String,
        example: 'Delhi',
        required: true
    })
    @IsString()
    city: string;

    @ApiProperty({
        type: String,
        example: 'Delhi',
        required: true
    })
    @IsString()
    state: string
}


export class BookingDetailsBookingHallDto {
    @ApiProperty({
        description: 'The unique identifier of the booking.',
        example: '544e7ccc-b06e-47e0-b243-7bf8687f20fa'
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: 'The date of the booking.',
        example: '2024-11-25'
    })
    @UtcToDateString()
    date: string;

    @ApiProperty({
        description: 'The number of seats allocated for this booking.',
        example: 250
    })
    @IsInt()
    seatsAllocated: number;

    @ApiProperty({
        description: 'The total price for the booking.',
        example: 20000
    })
    @IsInt()
    totalPrice: number;

    @ApiProperty({
        description: 'The hall information related to the booking.',
        type: BookingDetailsHallDto
    })
    @ValidateNested()
    @IsObject()
    @Type(() => BookingDetailsHallDto)
    hallRaw: BookingDetailsHallDto;

    @ApiProperty({
        description: 'The slot information related to the booking.',
        type: BookingDetailsSlotDto
    })
    @ValidateNested()
    @IsObject()
    @Type(() => BookingDetailsSlotDto)
    slotRaw: BookingDetailsSlotDto;
}


export class BookingDetailsContactDto {
    @ApiProperty({
        type: String,
        example: 'abc@gmail.com',
        required: false
    })
    email: string;

    @ApiProperty({
        type: String,
        example: '+91',
    })
    countryCode: string;

    @ApiProperty({
        type: String,
        example: '98878888'
    })
    phoneNumber: string
}
export class BookingDetailsDto {
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

    @ApiProperty({
        type: Number,
    })
    @IsNumber()
    noOfCandidates: 1000;

    @ApiProperty({
        type: Number,
    })
    @IsNumber()
    hallAllocated: 4;

    @ApiProperty({
        type: Number,
    })
    @IsNumber()
    totalCost: 80000;


    @ApiProperty({
        type: String,
        example: '2024-11-10'
    })
    @UtcToDateString()
    @IsString()
    startDate: string;

    @ApiProperty({
        type: String,
        example: '2024-11-25'
    })
    @UtcToDateString()
    @IsString()
    endDate: string;

    @ApiProperty({
        type: Date,
        example: '2024-11-10T16:51:29.834Z'
    })
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        type: Date,
        example: '2024-11-10T16:51:29.834Z'
    })
    @IsDate()
    updatedAt: Date;

    @ApiProperty({
        type: BookingDetailsContactDto,
        required: false
    })
    @IsObject()
    @Type(() => BookingDetailsContactDto)
    @IsOptional()
    contact: BookingDetailsContactDto;

    @ApiProperty({
        type: BookingDetailsAddressDto,
        required: true
    })
    @IsObject()
    @Type(() => BookingDetailsAddressDto)
    address: BookingDetailsAddressDto;

    @ApiProperty({
        type: [BookingDetailsBookingHallDto],
        required: false
    })
    @ValidateNested()
    @Type(() => BookingDetailsBookingHallDto)
    @IsOptional()
    bookingHall: BookingDetailsBookingHallDto[]
}


export class BookingDetailsResponseDto extends ResponseDto {
    @ApiProperty({
        type: BookingDetailsDto
    })
    @IsObject()
    @Type(() => BookingDetailsDto)
    result: BookingDetailsDto;
}