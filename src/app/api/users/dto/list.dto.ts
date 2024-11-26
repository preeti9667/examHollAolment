import { ListQueryDto, PaginateResultDto, ResponseDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { UserProfileDto } from "./profile.dto";
import { Type } from "class-transformer";

export class UserListQueryDto extends ListQueryDto {
    @ApiProperty({
        required: false,
        enum: ['createdAt', 'name', 'displayId', 'email'],
        default: 'createdAt',
    })
    @IsOptional()
    @IsEnum(['createdAt', 'name', 'displayId', 'email'])
    sortBy?: string;
}


export class UserListResultDto extends PaginateResultDto {
    @ApiProperty({
        type: [UserProfileDto],
    })
    @Type(() => UserProfileDto)
    data: UserProfileDto[]
}


export class UserListResponseDto extends ResponseDto {
    @ApiProperty({
        type: UserListResultDto
    })
    @Type(() => UserListResultDto)
    result: UserListResultDto;
}