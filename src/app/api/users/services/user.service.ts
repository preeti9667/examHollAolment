import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    constructor(
        private $logger: LoggerService
    ) {


    }

    list() {
        this.$logger.log("checking");
        return [{ name: 'user' }];
    }
}