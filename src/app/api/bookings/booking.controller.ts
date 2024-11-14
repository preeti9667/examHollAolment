import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { COMMON_HEADERS } from "@app/app.constant";
import { CreateBookingPayloadDto, CreateBookingResponseDto } from "./dto/create.dto";
import { AuthUser, Message } from "@app/decorators";
import { AuthGuard } from "@app/gaurds/auth.guard";
import { IAuthUser } from "../auth/interfaces/auth-user";
import { BookingStatus } from "./booking.constant";
import { BookingDetailParamsDto, BookingDetailsDto, BookingDetailsResponseDto } from "./dto/details.dto";
import { plainToInstance } from "class-transformer";

@Controller({
    path: 'booking',
    version: '1'
})
@ApiHeaders(COMMON_HEADERS)
@ApiTags('Booking')
export class BookingController {

    constructor(private $booking: BookingService) { }


    @Post('/')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message((req) => {
        if (req.body.status === BookingStatus.Draft) return 'BOOKING.DRAFT_CREATED';
        return 'BOOKING.AWAITING_FOR_PAYMENT';
    })
    @ApiOkResponse({ type: CreateBookingResponseDto })
    @ApiOperation({ summary: 'create or draft  booking by customer' })
    async create(
        @Body() payload: CreateBookingPayloadDto,
        @AuthUser() user: IAuthUser
    ) {
        return this.$booking.createBooking(payload, user.id);
    }



    @Get('/details/:id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('BOOKING.DETAILS')
    @ApiOkResponse({ type: BookingDetailsResponseDto })
    @ApiOperation({ summary: 'Booking details for customer' })
    async details(
        @Param() payload: BookingDetailParamsDto,
        @AuthUser() user: IAuthUser
    ) {
        const result = await this.$booking.bookingDetails(payload.id, user.id);
        return plainToInstance(BookingDetailsDto, result);
    }
}