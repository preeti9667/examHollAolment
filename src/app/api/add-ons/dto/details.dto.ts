import { ApiProperty } from "@nestjs/swagger";
import { ListAddOnsDto } from "./list.dto";
import { ResponseDto } from "@app/api/api.dto";

export class AddOnDetailsResultDto extends ListAddOnsDto {

}


export class AddOnDetailsResponseDto extends ResponseDto {
    @ApiProperty({
        type: AddOnDetailsResultDto
    })
    result: AddOnDetailsResultDto
}

