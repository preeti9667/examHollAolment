import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { CreateAddOnsDto } from "./create.dto";

export class AddonParamDto {
    @ApiProperty({
        type: String,
        description: 'unique identifier of addon',
        example: '13890811-23b6-409f-a753-7adedd90f2cf'
    })
    @IsUUID()
    @IsNotEmpty()
    id: string
}

export class EditAddOnsDto extends CreateAddOnsDto {
}
