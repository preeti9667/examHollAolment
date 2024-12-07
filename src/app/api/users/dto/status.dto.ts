import { ResponseDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsObject, IsString, IsUUID } from "class-validator";

export class StatusPayloadDto {
    @ApiProperty({
        type: Boolean,
        required: true,
        example: true
    })
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({
        type: String,
        required: true,
        example: 'user is doing unexpected things'
    })
    @IsNotEmpty()
    @IsString()
    reason: string;
}

export class StatusResultDto {
    @ApiProperty({
        type: String,
        required: true,
        example: 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2'
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        type: Boolean,
        required: true,
        example: true
    })
    @IsString()
    @IsBoolean()
    isActive: boolean;
}

export class StatusResponseDto extends ResponseDto {
    @ApiProperty({
        type: StatusResultDto,
        required: true
    })
    @IsObject()
    result: StatusResultDto
}