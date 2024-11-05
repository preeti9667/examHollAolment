import { Module } from "@nestjs/common";
import { ApiController } from "./api.controller";
import { ApiService } from "./api.service";
import { UserModule } from "./users";

@Module({
    imports: [UserModule],
    exports: [],
    controllers: [ApiController],
    providers: [ApiService]
})
export class ApiModule { }