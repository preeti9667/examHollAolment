import { ResponseDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class RoleListDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        type: String,
        example: 'SUPER_ADMIN',
    })
    @IsString()
    name: string;
}


export class RoleListResponseDto extends ResponseDto {
    @ApiProperty({
        type: [RoleListDto],
    })
    result: RoleListDto[];
}