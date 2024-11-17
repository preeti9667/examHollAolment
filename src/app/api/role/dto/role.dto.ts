import { AppModuleNames } from "@app/api/api.constant";
import { ApiProperty } from "@nestjs/swagger";

export class PermissionDto {
    @ApiProperty({
        type: String,
        description: 'name of module',
    })
    module: AppModuleNames;
    name: string;
}