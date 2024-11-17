import { AppModuleNames } from "@app/api/api.constant";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum } from "class-validator";

export class PermissionDto {
    @ApiProperty({
        type: String,
        description: 'name of module',
    })
    @IsEnum(AppModuleNames)
    module: AppModuleNames;

    @ApiProperty({
        type: [String],
        description: 'list of permissions',
        example: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
        enum: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS']
    })
    @IsEnum(['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'])
    actions: string;
}


export class RoleDto {
    @ApiProperty({
        type: String,
        description: 'id of role',
    })
    id: string;

    @ApiProperty({
        type: String,
        description: 'name of role',
    })
    name: string;
    @ApiProperty({
        type: Boolean,
    })
    @IsBoolean()
    isSuper: boolean;

    @ApiProperty({
        type: [PermissionDto],
        description: 'list of permissions',
    })
    permissions: PermissionDto[]

}