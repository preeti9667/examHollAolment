import { ListQueryDto, PaginateResultDto, ResponseDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsEnum, IsEmail, IsPhoneNumber, IsString, IsUUID } from "class-validator";

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


class ListRoleDto {
    @ApiProperty({
        description: 'Unique identifier of the role',
        example: 'ce33b161-d701-48a5-9baf-42e7bc528907',
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        description: 'Name of the role',
        example: 'SUPER_ADMIN',
    })
    @IsString()
    name: string;
}

export class ListAdminDetailsDto {
    @ApiProperty({
        description: 'Unique identifier of the user',
        example: '84c3ab68-7963-40c7-a52e-782814d7823d',
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        description: 'Display ID of the user',
        example: 'ZDBYU1M4',
    })
    @IsString()
    displayId: string;

    @ApiProperty({
        description: 'Name of the user',
        example: 'bpp',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Email address of the user',
        example: 'bpp@gmail.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Country code of the user\'s phone number',
        example: '+91',
    })
    @IsString()
    countryCode: string;

    @ApiProperty({
        description: 'Phone number of the user',
        example: '9882551111',
    })
    @IsPhoneNumber('IN') // You can specify the country code or leave it generic
    phoneNumber: string;

    @ApiProperty({
        description: 'Role associated with the user',
        type: ListRoleDto,
    })
    role: ListRoleDto;

    @ApiProperty({
        description: 'Creation timestamp of the user',
        example: '2024-11-21T17:07:17.505Z',
    })
    @IsString()
    createdAt: string;

    @ApiProperty({
        description: 'Last updated timestamp of the user',
        example: '2024-11-21T17:07:17.505Z',
    })
    @IsString()
    updatedAt: string;
}

export class ListAdminResultDto extends PaginateResultDto {
    @ApiProperty({
        description: 'List of users',
        type: [ListAdminDetailsDto],
    })
    data: ListAdminDetailsDto[];
}

export class ListAdminResponseDto extends ResponseDto {
    @ApiProperty({
        description: 'List of users',
        type: ListAdminResultDto,
    })
    result: ListAdminResultDto;
}