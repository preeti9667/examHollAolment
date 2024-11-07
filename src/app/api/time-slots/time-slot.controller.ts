import { Controller } from "@nestjs/common";
import { TimeSlotService } from "./time-slot.service";
import { ApiTags } from "@nestjs/swagger";

@Controller({
    path: 'slots',
    version: '1'
})
@ApiTags('Time Slot')
export class TimeSlotController {

    constructor(
        private $timeSlot: TimeSlotService
    ) { }


}