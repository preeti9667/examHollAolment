import { Injectable } from "@nestjs/common";
import { CreateHallDto } from "./dto/create.dto";
import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { OpenId } from "src/utils/open-id.util";

@Injectable()
export class HallService {

    constructor(
        private $logger: LoggerService,
        private $prisma: PrismaService
    ) {}

    async create(payload: CreateHallDto) {
        try {
            await this.$prisma.hall.create({
                data: {
                    displayId: OpenId.format('HALL'),
                    ...payload
                }
            })
            return true;
        } catch (err) {
            this.$logger.error(err.message, err.stack);
            throw err;
        }
    }

}