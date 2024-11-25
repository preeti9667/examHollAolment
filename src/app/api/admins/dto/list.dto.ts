import { ListQueryDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsEnum } from "class-validator";

export class ListAdminQueryDto extends ListQueryDto {
    @ApiProperty({
        required: false,
        enum: ['createdAt', 'name', 'displayId', 'email'],
        default: 'createdAt',
    })
    @IsOptional()
    @IsEnum(['createdAt', 'name', 'displayId', 'email'])
    sortBy?: string;
}


