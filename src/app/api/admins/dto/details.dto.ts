import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { ProfileDto } from "./profile.dto";
import { Type } from "class-transformer";
import { ResponseDto } from "@app/api/api.dto";

export class AdminParamDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
        description: 'unique identifier of the admin'
    })
    @IsNotEmpty()
    @IsUUID()
    id: string;
}


export class AdminDetailsStatusByDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
    })
    id: string;

    @ApiProperty({
        type: String,
        example: 'ASD12KJ'
    })
    displayId: string;


    @ApiProperty({
        type: String,
        example: 'Dr jai kal'
    })
    name: string;
}


export class AdminDetailsDto extends ProfileDto {

    @ApiProperty({
        type: String,
        example: 'this is a reason'
    })
    statusReason: string;


    @ApiProperty({
        type: AdminDetailsStatusByDto
    })
    @Type(() => AdminDetailsStatusByDto)
    statusBy: AdminDetailsStatusByDto;
}



export class AdminDetailsResponseDto extends ResponseDto {
    @ApiProperty({
        type: AdminDetailsDto
    })
    result: AdminDetailsDto;
}